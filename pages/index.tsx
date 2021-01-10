import React, { FC, useState } from 'react'

import { GetStaticProps } from 'next'

import { gql, useQuery } from '@apollo/client'
import debounce from 'lodash.debounce'
import Head from 'next/head'
import Skeleton from 'react-loading-skeleton'

import useConstant from '../hooks/useConstant'
import getGqlClient from '../lib/GqlClient'

type AppStaticProps = {
  btcMarketData: {
    date: string
    btcAmount: number
    markets: string[]
    bidsUsdValue: number
    asksUsdValue: number
    errorMessageList: string[]
    bestAsksMarketName: null | string
    bestBidsMarketName: null | string
  }
}

const btcMarketDataQuery = gql`
  query BtcMarketData($amount: Float!) {
    btcMarketData(amount: $amount) {
      date
      markets
      btcAmount
      errorMessageList
      bestBidsMarketName
      bestAsksMarketName
      bidsUsdValue
      asksUsdValue
    }
  }
`

function thousandSeparate(number: number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

function prettifyNumber(number: number, toFixed?: number) {
  return thousandSeparate(Number(number.toFixed(toFixed ?? 2))).replace('.', ',')
}

const App: FC<AppStaticProps> = (props) => {
  const [btcAmount, setBtcAmount] = useState(props.btcMarketData.btcAmount)

  const { data = { btcMarketData: props.btcMarketData }, loading } = useQuery<AppStaticProps>(
    btcMarketDataQuery,
    {
      variables: { amount: btcAmount },
      pollInterval: btcAmount > 5 ? 3000 : 1000,
    }
  )

  const { btcMarketData } = data

  const bitcoinsAmount = btcAmount === 1 ? '1 Bitcoin' : `${prettifyNumber(btcAmount)} Bitcoins`
  const debouncedRefetch = useConstant(() =>
    debounce((value: number) => {
      setBtcAmount(value)
    }, 300)
  )

  return (
    <>
      <Head>
        <title>Crypto</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>{bitcoinsAmount}</h1>
        <p>
          It compares results from markets:{' '}
          {btcMarketData.markets.map((name) => (
            <React.Fragment key={name}>{name} </React.Fragment>
          ))}
        </p>

        <h2>Where should you trade to sell your Bitcoins?</h2>
        {loading ? <Skeleton /> : <p>{btcMarketData.bestBidsMarketName ?? 'no results'}</p>}

        <h2>You will sell {bitcoinsAmount} for</h2>
        {loading ? (
          <Skeleton />
        ) : (
          <p>
            {btcMarketData.bidsUsdValue
              ? `${prettifyNumber(btcMarketData.bidsUsdValue)} $`
              : 'no results'}
          </p>
        )}

        <h2>Where should you trade to buy some Bitcoins?</h2>
        {loading ? <Skeleton /> : <p>{btcMarketData.bestAsksMarketName ?? 'no results'}</p>}

        <h2>You will buy {bitcoinsAmount} for</h2>
        {loading ? (
          <Skeleton />
        ) : (
          <p>
            {btcMarketData.asksUsdValue
              ? `${prettifyNumber(btcMarketData.asksUsdValue)} $`
              : 'no results'}
          </p>
        )}

        <h2>last update:</h2>
        {loading ? <Skeleton /> : <p>{btcMarketData.date}</p>}

        <input
          type="number"
          min={0}
          defaultValue={btcMarketData.btcAmount}
          onChange={(e) => {
            const value = Number(e.target.value)
            if (value < 0) return
            debouncedRefetch(Number(e.target.value))
          }}
        />

        {btcMarketData.errorMessageList.map((errorMessage) => (
          <p key={errorMessage} style={{ color: 'red' }}>
            {errorMessage}
          </p>
        ))}
      </main>
      <style jsx>{`
        p {
          margin: 0;
        }
        input {
          margin: 15px 0;
          height: 25px;
          border-radius: 10px;
        }
        .react-loading-skeleton {
          width: 100px;
        }

        main {
          padding: 20px;
          max-width: 1000px;
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </>
  )
}

export default App

export const getStaticProps: GetStaticProps<AppStaticProps> = async () => {
  const gqlApiEndpoint = process.env.GQL_API_ENDPOINT

  const client = getGqlClient(gqlApiEndpoint)

  const {
    data: { btcMarketData },
  } = await client.query({
    query: btcMarketDataQuery,
    variables: { amount: 2 },
  })

  return { props: { btcMarketData, gqlApiEndpoint }, revalidate: 1 }
}
