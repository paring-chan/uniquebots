import React, { Component } from 'react'
import Header from './Header'

class Layout extends Component {
  render() {
    return (
      <>
        <Header />
        <div className="md:container mx-auto mt-12">
          <div className="p-2">{this.props.children}</div>
        </div>
      </>
    )
  }
}

export default Layout
