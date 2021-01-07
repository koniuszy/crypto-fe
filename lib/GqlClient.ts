import { ApolloClient, InMemoryCache } from '@apollo/client'

function getGqlClient(uri: string) {
  return new ApolloClient({
    uri,
    cache: new InMemoryCache(),
  })
}

export default getGqlClient
