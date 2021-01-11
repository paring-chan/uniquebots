import React, { Component } from 'react'
import Header from './Header'

class Layout extends Component {
  render() {
    return (
      <>
        <Header />
        <div className="container mx-auto">{this.props.children}</div>
      </>
    )
  }
}

export default Layout
