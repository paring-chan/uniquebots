import React, { Component } from 'react'

type Props = {
  handle: () => void
}

class ClickAwayHandler extends Component<Props> {
  node?: HTMLDivElement

  handleClick = (e: MouseEvent) => {
    if (this.node) {
      if (this.node.contains(e.target as Element)) {
        return
      }
      this.props.handle()
    }
  }
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick, false)
  }
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false)
  }

  render() {
    return (
      <div ref={(node) => (this.node = node || undefined)}>
        {this.props.children}
      </div>
    )
  }
}

export default ClickAwayHandler
