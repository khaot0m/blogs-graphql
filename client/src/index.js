import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker'

import { AUTH_TOKEN } from './constants'

import {
  ApolloClient,
  ApolloLink,
  split,
  InMemoryCache,
  HttpLink
} from 'apollo-boost'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { ApolloProvider } from 'react-apollo'

import styledNormalize from 'styled-normalize'
import { injectGlobal } from 'styled-components'
import { Color } from './styles/variables'

import App from './containers/App'

const injectNormalizeCSS = () => injectGlobal`
  ${styledNormalize}

  html {
    font-size: 62.5%;
  }
  body {
    color: ${Color.textDark};
    padding: 0;
    font-family: sans-serif;
    
  }
  input {
    border: 0;
    height: 40px;
    font-size: 2rem;
    text-align: center;
    transition: ease-out 0.2s;
    border-bottom: 1px solid $light-grey;
    
    &:focus {
      outline: none;
    }
    
    &:active {
      color:red;
    }
    
  }
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 50px #efefef inset;
  }
  textarea {
    text-align: left;
    font-size: 2rem;
  }
`

// Apollo Client
const httpLink = new HttpLink({ uri: 'http://localhost:4000/graphql/' })

const middlewareAuthLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem(AUTH_TOKEN)
  const authorizationHeader = token ? `Bearer ${token}` : null
  operation.setContext({
    headers: {
      authorization: authorizationHeader
    }
  })
  return forward(operation)
})

const httpLinkWithAuthToken = middlewareAuthLink.concat(httpLink)

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/subscriptions`,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem(AUTH_TOKEN)
    }
  }
})

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLinkWithAuthToken
)

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
})

const renderApp = () => {
  injectNormalizeCSS()

  ReactDOM.render(
    <Router>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </Router>,
    document.getElementById('root')
  )
  registerServiceWorker()
}

renderApp()
