import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Router from 'next/router'

const SearchBar = ({ initial }: { initial?: string }) => {
  const [keyword, setKeyword] = React.useState(initial || '')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!keyword) return
        return Router.push(
          '/search/[id]',
          '/search/' + encodeURIComponent(keyword),
        )
      }}
      className="dark:bg-discord-black border-2 border-discord-black rounded-md flex w-full"
    >
      <input
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        type="text"
        placeholder="봇 검색하기"
        className="bg-transparent p-3 outline-none flex-grow min-w-0"
      />
      <button type="submit" className="p-3 bg-transparent">
        <FontAwesomeIcon size="2x" icon={['fas', 'search']} />
      </button>
    </form>
  )
}

export default SearchBar
