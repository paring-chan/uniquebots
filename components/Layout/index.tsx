import React, { Component } from 'react'
import Footer from './Footer'
import Header from './Header'

class Layout extends Component {
  render() {
    return (
      <>
        <Header />
        <div className="container mx-auto mt-12">
          <div className="p-2">{this.props.children}</div>
        </div>
        <Footer />
      </>
    )
  }
}

export default Layout
