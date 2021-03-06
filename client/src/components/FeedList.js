import React, { Component } from 'react'

import Post from './Post/Post'

import withUser from '../HOC/withUser'

class FeedList extends Component {
  componentDidMount() {
    this.props.subscribeToNewLikes()
    this.props.subscribeToNewComments()
  }

  render() {
    return this.props.blogs.map(post => (
      <Post key={post._id} post={post} user={this.props.user} />
    ))
  }
}

export default withUser(FeedList)
