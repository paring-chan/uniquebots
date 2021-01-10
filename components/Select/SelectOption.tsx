import clsx from 'clsx'
import React from 'react'
import { OptionProps } from 'react-select'

const SelectOption = (props: OptionProps<any, any>) => {
  const {
    children,
    className,
    getStyles,
    isDisabled,
    isFocused,
    isSelected,
    innerRef,
    innerProps,
  } = props
  return (
    <div
      ref={innerRef}
      // @ts-ignore
      css={getStyles('option', props)}
      className={clsx(
        className,
        {
          option: true,
          //   'option--is-disabled': isDisabled,
          //   'option--is-focused': isFocused,
          //   'option--is-selected': isSelected,
          'bg-blue-600 text-white': !isDisabled && (isFocused || isSelected),
          'dark:bg-discord-black text-black dark:text-white':
            (!isFocused && !isSelected) || isDisabled,
        },
        'p-2 transition-all',
      )}
      {...innerProps}
    >
      {children}
    </div>
  )
}

export default SelectOption
