import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import styled from 'styled-components'

import { Button } from './reusable'

import { AUTH_USER, AUTH_TOKEN } from '../constants'

class Login extends Component {
  state = {
    login: true, // switch between Login and SignUp
    email: '',
    password: '',
    name: ''
  }

  _confirm = async e => {
    e.preventDefault()
    const { name, email, password } = this.state
    if (this.state.login) {
      const result = await this.props.loginMutation({
        variables: {
          email,
          password
        }
      })
      const { token, user } = result.data.login

      // TODO - persist entire user not just token

      this._saveUserData(token, user)
    } else {
      const result = await this.props.signupMutation({
        variables: {
          displayName: name,
          email,
          password
        }
      })
      const { token, user } = result.data.signup
      this._saveUserData(token, user)
    }
    this.props.history.push(`/`)
  }

  _saveUserData = (token, user) => {
    localStorage.setItem(AUTH_USER, JSON.stringify(user))
    localStorage.setItem(AUTH_TOKEN, token)
  }

  render() {
    return (
      <Container>
        <h2>{this.state.login ? '🍑 Login' : '📝 SignUp'}</h2>
        <form onSubmit={e => this._confirm(e)}>
          {!this.state.login && (
            <input
              value={this.state.name}
              onChange={e => this.setState({ name: e.target.value })}
              type="text"
              placeholder="Your Nickname"
              autoComplete="off"
            />
          )}
          <input
            value={this.state.email}
            onChange={e => this.setState({ email: e.target.value })}
            type="text"
            placeholder="📧"
            autoComplete="off"
          />
          <input
            value={this.state.password}
            onChange={e => this.setState({ password: e.target.value })}
            type="password"
            placeholder="🔏"
            autoComplete="off"
          />
          <ButtonGroup>
            <Button type="submit">
              {this.state.login ? 'Login' : 'Create Account'}
            </Button>
            <Button onClick={() => this.setState({ login: !this.state.login })}>
              {this.state.login
                ? 'Need to create an account?'
                : 'Already have an account?'}
            </Button>
          </ButtonGroup>
        </form>
      </Container>
    )
  }
}

const Container = styled.div`
  display: flex;
  flex-direction: column;

  h2 {
    font-size: 5rem;
  }
  form {
    display: flex;
    flex-direction: column;

    margin-bottom: 15px;
  }
  input {
    font-size: 4rem;
    padding: 1rem;
    margin-bottom: 1rem;
  }
`
const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;

  button {
    width: 49%;
  }
`

const SIGNUP_MUTATION = gql`
  mutation SignupMutation(
    $email: String!
    $password: String!
    $displayName: String!
    $firstname: String
    $surname: String
  ) {
    signup(
      email: $email
      password: $password
      displayName: $displayName
      firstname: $firstname
      surname: $surname
    ) {
      token
      user {
        _id
        displayName
      }
    }
  }
`

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        displayName
      }
    }
  }
`

export default compose(
  graphql(SIGNUP_MUTATION, { name: 'signupMutation' }),
  graphql(LOGIN_MUTATION, { name: 'loginMutation' })
)(Login)
