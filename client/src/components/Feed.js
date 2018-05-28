import React, { Component } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import styled from 'styled-components'

import { EmojiButton } from './reusable'

import Post from './Post'

import withPagination from '../HOC/withPagination'

export const FEED_QUERY = gql`
  query feed($skip: Int, $limit: Int, $searchTerm: String) {
    feed(skip: $skip, limit: $limit, searchTerm: $searchTerm) {
      _id
      title
      content
      imageUrl
      likes {
        _id
      }
      _user {
        displayName
        firstname
        surname
      }
    }
  }
`

class Feed extends Component {
  render() {
    const {
      feedVariables: { skip, limit, searchTerm },
      paginateBack,
      paginateForward
    } = this.props

    console.log('feed rendered')
    return (
      <React.Fragment>
        <Query query={FEED_QUERY} variables={{ skip, limit, searchTerm }}>
          {({ loading, error, data, refetch }) => {
            if (loading) return 'Loading...'
            if (error) return `Error! ${error.message}`

            return (
              <React.Fragment>
                {data.feed.map(post => <Post key={post._id} {...post} />)}
                <Pagination>
                  {!!skip && (
                    <EmojiButton onClick={() => paginateBack()}>👈</EmojiButton>
                  )}

                  {data.feed.length === 5 && (
                    <EmojiButton
                      style={{ marginLeft: 'auto' }}
                      onClick={() => paginateForward()}
                    >
                      👉
                    </EmojiButton>
                  )}
                </Pagination>
              </React.Fragment>
            )
          }}
        </Query>
      </React.Fragment>
    )
  }
}

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;

  width: 50vw;
  margin: 10rem 0;
`

export default withPagination(Feed)
