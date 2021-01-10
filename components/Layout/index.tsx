import React, { Component } from 'react'
import Header from './Header'

class Layout extends Component {
  render() {
    return (
      <div>
        <Header />
        <div className="md:px-24 px-2">{this.props.children}</div>
      </div>
    )
  }
}

export default Layout
