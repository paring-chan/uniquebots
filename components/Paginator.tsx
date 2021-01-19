import clsx from 'clsx'
import React from 'react'
import _ from 'lodash'

const Paginator = ({
  current = 1,
  items: i = 1,
  itemsPerPage = 1,
  onChange,
}: {
  current?: number
  items?: number
  itemsPerPage?: number
  onChange: (v: number) => void
}) => {
  return (
    <div className="flex justify-center gap-1">
      {(() => {
        const pages = _.chunk(new Array(i).fill(''), itemsPerPage).length

        const items = new Array(pages).fill(null).map((it, idx) => idx + 1)
        return items
          .slice(
            pages <= 4
              ? 0
              : current <= 3
              ? 0
              : current === pages
              ? current - 5
              : current - 4,
            pages <= 4
              ? items.length
              : current <= 3
              ? 7
              : current === pages
              ? current
              : current + 3,
          )
          .map((it, key) => (
            <div
              key={key}
              className={clsx(
                'p-2 rounded-full w-8 h-8 flex justify-center cursor-pointer transition-colors',
                {
                  'bg-blue-500 text-white': current === it,
                  'dark:bg-discord-black bg-gray-100 text-black dark:text-white':
                    current !== it,
                },
              )}
              style={{ alignItems: 'center' }}
              onClick={() => onChange(it)}
            >
              {it}
            </div>
          ))
      })()}
    </div>
  )
}

export default Paginator
