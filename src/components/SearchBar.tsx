import { useState } from 'react'
interface SearchBarProps {
  onSearch: (query: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [query, setQuery] = useState("")

    const handleSearch = () => {
        if(query.trim()){

        onSearch(query)
        }
    }
    const handleKeyPress = (e: React.KeyboardEvent) => {
      if(e.key === "enter"){
        handleSearch()
      }
    }
  return (
    <div className='flex items-center space-x-2'>
        <input type="text" 
        placeholder="Search Players" 
        value={query} 
        onChange={(e) => 
        setQuery(e.target.value)} 
        onKeyDown={handleKeyPress}
        className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
        />
        <button
        onClick={handleSearch}
        className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>
            Search
        </button>
    </div>
  )
}

export default SearchBar