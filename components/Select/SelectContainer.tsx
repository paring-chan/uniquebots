import React from 'react'
import { ContainerProps, components } from 'react-select'

const SelectContainer = (props: ContainerProps<any, any>) => {
  const { children } = props
  return (
    <components.SelectContainer {...props}>
      {children}
    </components.SelectContainer>
  )
}

export default SelectContainer
