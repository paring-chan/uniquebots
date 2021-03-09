import React, { Component } from 'react';

class Advertisement extends Component<{ className?: string }> {
  componentDidMount() {
    ;(window as any).adfit?.()
  }
  componentWillUnmount() {
  }

  render() {
    return (
        <div className={this.props.className}>
          <ins
              className="kakao_ad_area"
              style={{ display: 'none' }}
              data-ad-unit="DAN-cg3Y6eju0wg9GWlA"
              data-ad-width="320"
              data-ad-height="100"
          />
        </div>
    )
  }
}

export default Advertisement