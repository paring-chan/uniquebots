import React, { Component } from 'react'
import Header from './Header'

class Layout extends Component {
  render() {
    return (
      <>
        <Header />
        <div className="container mx-auto mt-16">{this.props.children}</div>
      </>
    )
  }
}

export default Layout
