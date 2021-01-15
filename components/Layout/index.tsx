import React, { Component } from 'react'
import Footer from './Footer'
import Header from './Header'

class Layout extends Component<any> {
  render() {
    return (
      <div className="flex flex-col" style={{ minHeight: '100vh' }}>
        <Header {...(this.props as any)} />
        <div className="container mx-auto mt-12 flex-grow">
          <div className="p-2">{this.props.children}</div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default Layout
