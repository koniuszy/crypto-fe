import React from 'react'

import { ApolloProvider } from '@apollo/client'

import getGqlClient from '../lib/GqlClient'

function MyApp({ Component, pageProps }) {
  const client = getGqlClient(pageProps.gqlApiEndpoint)

  return (
    <>
      <style global jsx>
        {`
          html {
            background: #18181b;
          }
          body {
            display: flex;
            margin: 0;
            height: 100vh;
            color: white;
            background: linear-gradient(#18181b, #323646);
          }
        `}
      </style>
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </>
  )
}

export default MyApp
