import { useState, useEffect } from "react";
import { Player } from "../types/types";
import EditPlayer from "./EditPlayer";
interface PlayerListProps {
  apiUrl: string;
  searchQuery: string;
}
import { useAuth } from "@/utils/AuthContext";

export const PlayerList: React.FC<PlayerListProps> = ({
  apiUrl,
  searchQuery,
}) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [isFormVisible, setIsFormVisible] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedServer, setSelectedServer] = useState<string>("none");
  const [sortOption, setSortOption] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Added for sorting direction

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/api/fortniteplayers`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
      );
      if (!response.ok) {
        console.error(`Failed to fetch players, status: ${response.status}`);
        return;
      }
      const data: Player[] = await response.json();
      setPlayers(data);
      setFilteredPlayers(data);
    } catch (error) {
      console.error("Error fetching players:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
        comparison = a.earnings - b.earnings;
      } else if (sortOption === "age") {
        comparison = a.age - b.age;
      }

      // Adjust sorting direction
      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredPlayers(filtered);
  };

  useEffect(() => {
    applyFiltersAndSorting();
  }, [selectedServer, sortOption, searchQuery, sortOrder]);

  const handleToggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

    const handleDelete = async (player: Player) => {
    console.log(player);
    console.log("Delete", player.name, player.id);
  };

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
                  Earnings:{" "}
                  <span className="font-medium">{player.earnings}</span>
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
                    <EditPlayer player={player} onSave={() => {}} />
                  )}
                   <button
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                    onClick={() => handleDelete(player)}
                  >
                    Delete
                  </button>
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
