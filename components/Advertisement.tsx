import React, { Component } from 'react'

const googleAdId = 'ca-pub-4808458196722819'

const slot = '1227211759'

class Advertisement extends Component<{ className?: string }> {
  googleInit: any = null

  componentDidMount() {
    this.googleInit = setTimeout(() => {
      if (typeof window !== 'undefined')
        // @ts-ignore
        (window.adsbygoogle || []).push({})
    }, 1000)
  }
  componentWillUnmount() {
    if (this.googleInit) clearTimeout(this.googleInit)
  }

  render() {
    return (
      <div className={this.props.className}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={googleAdId}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>
    )
  }
}

export default Advertisement
