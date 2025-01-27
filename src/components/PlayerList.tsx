import { useState, useEffect } from "react";
import { Player } from "../types/types";
import EditPlayer from "./EditPlayer";
import { useAuth } from "@/utils/AuthContext";
// import local from "next/font/local";

interface PlayerListProps {
  apiUrl: string;
  searchQuery: string;
}

export const PlayerList: React.FC<PlayerListProps> = ({
  apiUrl,
  searchQuery,
}) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [isFormVisible, setIsFormVisible] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedServer, setSelectedServer] = useState<string>("none");
  const [sortOption, setSortOption] = useState<string>("name"); // Default to sorting by name
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Default to ascending order

  // Fetch players function (with retry and timeout)
  const fetchWithTimeout = async (
    url: string,
    options: RequestInit,
    timeout: number
  ): Promise<Response> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timer); // Ensure the timer is cleared when the response is received
      return response;
    } catch (error: any) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error("Request timed out");
      }
      throw error;
    }
  };

  const fetchPlayers = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetchWithTimeout(
        `${apiUrl}/api/fortniteplayers`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
        15000 // increased timeout for testing
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to fetch players:", response.status, errorData);
        return;
      }

      const data: Player[] = await response.json();
      setPlayers(data);
      setFilteredPlayers(data);
    } catch (error) {
      alert('You have insufficient permissions, apply for admin role. We will show you what your edit looks like, but it will NOT be saved to our database')
    } finally {
      setIsLoading(false);
    }
  };

  // Update player information
const updatePlayer = async (updatedPlayer: Player) => {
  console.log(updatedPlayer); // Log the updated player data

  // Update player list with the new data
  const updatedPlayers = players.map((player) =>
    player.id === updatedPlayer.id ? updatedPlayer : player
  );
  setPlayers(updatedPlayers);

  try {
    const token = localStorage.getItem("authToken");
    console.log (token)

    if (!token) {
      console.log('No token found');
      window.location.href = '/login';
      return; // Exit early if no token
    }

    // Make the PUT request to update the player
    const response = await fetch(`https://goldfish-app-hqk2o.ondigitalocean.app/api/fortniteplayers/${updatedPlayer.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updatedPlayer),
      redirect: 'manual', // Send the correct player data
    });
    
    if (response.ok) {
      const updatedPlayerData = await response.json(); // Get updated player data from the response
      console.log('Player updated successfully:', updatedPlayerData);
    } else {
      throw new Error('Failed to update player');
    }

  } catch (error) {
    console.error('Error updating player:', error);
    // Optionally, set an error state to display to the user
    // setError('Failed to update player');
  }

  // Update filtered players as well
  setFilteredPlayers(updatedPlayers);

  // Close the edit form
  setIsFormVisible((prevState) => ({
    ...prevState,
    [updatedPlayer.id]: false,
  }));
};



  // Apply sorting and filtering
  const applyFiltersAndSorting = () => {
    let filtered = [...players];

    // Apply search query filtering
    if (searchQuery) {
      filtered = filtered.filter((player) =>
        player.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply server filter
    if (selectedServer !== "none") {
      filtered = filtered.filter((player) => player.server === selectedServer);
    }

    // Apply sorting based on selected option and order
    filtered.sort((a, b) => {
      let comparison = 0;

      if (sortOption === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortOption === "earnings") {
        comparison = (a.earnings || 0) - (b.earnings || 0);
      } else if (sortOption === "age") {
        comparison = (a.age || 0) - (b.age || 0);
      }

      // Adjust sorting direction (ascending or descending)
      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredPlayers(filtered);
  };

  // Call `applyFiltersAndSorting` when relevant states change
  useEffect(() => {
    fetchPlayers();
  }, [apiUrl, token]); // Only call fetchPlayers once (on first load)

  useEffect(() => {
    applyFiltersAndSorting();
  }, [searchQuery, selectedServer, sortOption, sortOrder, players]);

  // Handle page change (pagination)
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle sorting order toggle
  const handleToggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // Handle toggle form visibility (Edit button)
  const handleToggleForm = (playerId: number) => {
    setIsFormVisible((prevState) => ({
      ...prevState,
      [playerId]: !prevState[playerId],
    }));
  };

  const totalPages = Math.ceil(filteredPlayers.length / itemsPerPage);
  const paginatedPlayers = filteredPlayers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto px-4">
      {isLoading ? (
        <div className="text-center py-6">Loading players...</div>
      ) : (
        <>
          <div className="mb-4 flex space-x-4">
            {/* Server Filter */}
            <div>
              <label htmlFor="server" className="mr-2 text-white">
                Filter by Server
              </label>
              <select
                id="server"
                value={selectedServer}
                onChange={(e) => setSelectedServer(e.target.value)}
                className="border p-2 rounded text-black"
              >
                <option value="none">All Servers</option>
                <option value="NAE">NAE</option>
                <option value="NAW">NAW</option>
                <option value="EU">EU</option>
              </select>
            </div>

            {/* Sorting Option */}
            <div>
              <label htmlFor="sort" className="mr-2 text-white">
                Sort by
              </label>
              <select
                id="sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="border p-2 rounded text-black"
              >
                <option value="name">Name</option>
                <option value="earnings">Earnings</option>
                <option value="age">Age</option>
              </select>
            </div>

            {/* Sort Order Toggle */}
            <div>
              <button
                onClick={handleToggleSortOrder}
                className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
              >
                {sortOrder === "asc" ? "Descending" : "Ascending"}
              </button>
            </div>
          </div>

          {/* Player List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {paginatedPlayers.map((player) => (
              <div
                key={player.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {player.name}
                </h3>
                <p className="text-gray-600 mb-2">
                  Server: <span className="font-medium">{player.server}</span>
                </p>
                <p className="text-gray-600 mb-2">
                  Earnings: <span className="font-medium">{player.earnings}</span>
                </p>
                <p className="text-gray-600 mb-4">
                  Age: <span className="font-medium">{player.age}</span>
                </p>
                <div className="flex justify-between items-center">
                  <button
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                    onClick={() => handleToggleForm(player.id)}
                  >
                    {isFormVisible[player.id] ? "Cancel" : "Edit"}
                  </button>
                  {isFormVisible[player.id] && (
                    <EditPlayer
                      player={player}
                      onSave={updatePlayer} // Pass the update function
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 mx-1 rounded ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PlayerList;
