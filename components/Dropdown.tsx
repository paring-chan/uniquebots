import clsx from 'clsx'
import React from 'react'
import { Manager, Popper, Reference } from 'react-popper'
import ClickAwayHandler from './ClickAwayHandler'

const Dropdown = ({
  children,
  button,
  leftOffset = 0,
}: {
  children: (fn: { close: () => void }) => React.ReactNode
  button: (data: { opened: boolean }) => React.ReactNode
  leftOffset?: number
}) => {
  const [open, setOpen] = React.useState(false)

  return (
    <ClickAwayHandler handle={() => setOpen(false)}>
      <Manager>
        <Reference>
          {({ ref }) => (
            <div onClick={() => setOpen(!open)} ref={ref}>
              {button({ opened: open })}
            </div>
          )}
        </Reference>
        <Popper
          modifiers={[
            {
              name: 'offset',
              options: {
                offset: [leftOffset, open ? 20 : 30],
              },
            },
          ]}
        >
          {({ placement, ref, style }) => (
            <div
              ref={ref}
              style={{ ...style, zIndex: 999999 }}
              data-replacement={placement}
              className={clsx(
                'bg-white text-black p-1 dark:bg-discord-black dark:text-white dark:ring-discord-black rounded-md shadow-lg ring-white ring-2 transition-all',
                {
                  'opacity-0': !open,
                  'pointer-events-none': !open,
                },
              )}
            >
              {children({
                close: () => setOpen(false),
              })}
            </div>
          )}
        </Popper>
      </Manager>
    </ClickAwayHandler>
  )
}

export default Dropdown
