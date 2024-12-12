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
  const [isFormVisible, setIsFormVisible] = useState<{
    [key: string]: boolean;
  }>({});
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchPlayers();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredPlayers(
        players.filter((player) =>
          player.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredPlayers(players);
    }
  }, [searchQuery, players]);

  const handleToggleForm = (playerId: number) => {
    setIsFormVisible((prevState) => ({
      ...prevState,
      [playerId]: !prevState[playerId],
    }));
  };

const fetchPlayers = async () => {
  try {
    setIsLoading(true)
    const response = await fetch(`${apiUrl}/api/fortniteplayers`);
    if (!response.ok) {
      console.error(`Failed to fetch players, status: ${response.status}`);
      return;
    }
    const data: Player[] = await response.json();
    setPlayers(data);
    setFilteredPlayers(data);
    console.log(data)
  } catch (error) {
    console.error("Error fetching players:", error);
  } finally {
    setIsLoading(false);
  }
};

 if (!token) {
      console.error("No token available. User is not authenticated.");
      return;
    }


  const handleUpdate = async (updatedPlayer: Player) => {
    console.log(updatedPlayer);
    console.log("Update", updatedPlayer.name, updatedPlayer.id);
    
    try {
      const response = await fetch(`${apiUrl}/api/fortniteplayers/${updatedPlayer.id}`, {
        method: "PUT",
        // mode: 'no-cors',
        headers: {
          "Content-Type": "application/json",
           Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedPlayer),
      })
     if(!response.ok){
      console.error(`Failed to update player ${updatedPlayer.name}`)
     } 
     const data = await response.json();
     console.log(data)
     setPlayers(prevState => 
        prevState.map(player =>
          player.id === updatedPlayer.id ? updatedPlayer : player
        )
     )
     setFilteredPlayers(prevState => 
      prevState.map(player =>
        player.id === updatedPlayer.id ? updatedPlayer : player
      )
     )
     setIsFormVisible((prevState) => ({
      ...prevState,
      [updatedPlayer.id]: false,
     }))
    } catch (error) {
      console.error(error);
    }
  };
  const handleDelete = async (player: Player) => {
    console.log(player);
    console.log("Delete", player.name, player.id);
  };

  // find the difference between original object and new object
  // save the difference
  // rerender the component that has the difference, but only that component

  const totalPages = Math.ceil(filteredPlayers.length / itemsPerPage);
  const paginatedPlayers = filteredPlayers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
    const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  return (
    <div className="container mx-auto px-4">
      {isLoading ? (
        <div className="text-center py-6">Loading players...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {paginatedPlayers.map((player) => (
              <div
                key={player.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{player.name}</h3>
                <p className="text-gray-600 mb-2">
                  Server: <span className="font-medium">{player.server}</span>
                </p>
                <p className="text-gray-600 mb-2">
                  Earnings: <span className="font-medium">{player.earnings}</span>
                </p>
                <p className="text-gray-600 mb-4">
                  Age: <span className="font-medium">{player.age}</span>
                </p>
                <p className="text-gray-600 mb-4">
                  Team: <span className="font-medium">{player.teamName}</span>
                </p>
                <div className="flex justify-between items-center">
                  <button
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                    onClick={() => handleToggleForm(player.id)}
                  >
                    {isFormVisible[player.id] ? "Cancel" : "Edit"}
                  </button>
                  {isFormVisible[player.id] && (
                    <EditPlayer player={player} onSave={handleUpdate} />
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
