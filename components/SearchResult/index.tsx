import React, { Component } from 'react'
import SearchBar from '../../components/SearchBar'
import { Bot } from '../../types'
import BotCard from '../BotCard'

type Props = {
  keyword: string
  results: Bot[]
}

class SearchResult extends Component<Props> {
  render() {
    return (
      <div>
        <SearchBar initial={this.props.keyword} />
        <h2 className="text-2xl pt-2">검색 결과 - {this.props.keyword}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 grid-cols-1">
          {this.props.results.length
            ? this.props.results.map((it: Bot, key) => (
                <BotCard key={key} bot={it} />
              ))
            : '검색 결과가 없습니다.'}
        </div>
      </div>
    )
  }
}

export default SearchResult
