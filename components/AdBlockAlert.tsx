import React from 'react'
import RINGS from 'vanta/dist/vanta.rings.min'
import * as THREE from 'three'

class AdBlockAlert extends React.Component {
  vantaRef: any = React.createRef()
  vantaEffect: any

  componentDidMount() {
    this.vantaEffect = RINGS({
      el: this.vantaRef.current,
      THREE,
    })
  }

  render() {
    return (
      <div
        style={{ width: '100vw', height: '100vh', position: 'fixed' }}
        ref={this.vantaRef}
      >
        <div className="p-12 md:p-24 lg:w-1/2">
          <div className="text-2xl">Adblock을 비활성화 해주세요!</div>
          <button
            onClick={() => window.location.reload()}
            className="py-2 px-4 text-white bg-blue-500"
          >
            새로고침
          </button>
        </div>
      </div>
    )
  }
}

export default AdBlockAlert
