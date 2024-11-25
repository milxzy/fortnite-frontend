import { useState, useEffect } from "react";
import { Player } from "../types/types";
interface PlayerListProps {
  apiUrl: string;
  searchQuery: string;
}

export const PlayerList: React.FC<PlayerListProps> = ({ apiUrl, searchQuery }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([])

  useEffect(() => {
    fetchPlayers();
  });

  useEffect(() => {
    if(searchQuery){
        setFilteredPlayers(
            players.filter((player) => 
                player.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
        )
    } else {
        setFilteredPlayers(players)
    }
  }, [searchQuery, players])

  const fetchPlayers = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/fortniteplayers`);
      const data: Player[] = await response.json();
      setPlayers(data);
      setFilteredPlayers(data)
    } catch {
      console.error("failed to get players");
    }
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {filteredPlayers.map((player) => (
        <div key={player.id} className="p-4 border rounded shadow">
          <h3 className="text-lg font-bold">{player.name}</h3>
          <p>{player.team}</p>
          <button
            className="text-red-500"
            onClick={() => console.log("Delete", player.name, player.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default PlayerList;