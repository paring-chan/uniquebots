import clsx from 'clsx'
import React from 'react'
import { ControlProps, components } from 'react-select'

const SelectControl = (props: ControlProps<any, any>) => {
  return (
    <components.Control
      {...props}
      className={clsx(props.className, {
        'dark:bg-discord-black': true,
      })}
    />
  )
}

export default SelectControl
