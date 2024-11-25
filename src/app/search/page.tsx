
"use client"
import SearchBar from '@/components/SearchBar'
import PlayerList from '@/components/PlayerList'
import { useState } from 'react'

const Search = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    }

  return (
    <div className="p-8">
        <h1 className='text-2xl font-bold mb-4'> Search Players</h1>
        <SearchBar onSearch={handleSearch}></SearchBar>
        <div className="mt-6">
            <PlayerList apiUrl={apiUrl} searchQuery={searchQuery}></PlayerList>
        </div>
    </div>
  )
}

export default Search