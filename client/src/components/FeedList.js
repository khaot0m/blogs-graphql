import React, { Component } from 'react'

import Post from './Post'

class FeedList extends Component {
  componentDidMount() {
    this.props.subscribeToNewLikes()
  }
  render() {
    return this.props.feed.map(post => <Post key={post._id} {...post} />)
  }
}

export default FeedList