import clsx from 'clsx'
import React from 'react'
import { components, MultiValueProps } from 'react-select'

const SelectMultiValue = (props: MultiValueProps<any>) => {
  const { className } = props
  return (
    <components.MultiValue
      {...props}
      className={clsx(className, {
        'bg-blue-500 text-white': true,
      })}
    />
  )
}

export default SelectMultiValue
