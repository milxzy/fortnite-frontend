import { useState } from "react";
import { Player } from "../types/types";

interface EditPlayerProps {
  player: Player;
  onSave: (updatedPlayer: Player) => void;
  //hasEditPermission: boolean; // Prop for permission checking

}

const EditPlayer: React.FC<EditPlayerProps> = ({
  player,
  onSave,
  //hasEditPermission,
}) => {
  const [formData, setFormData] = useState<Player>(player);
  const [error, setError] = useState<string | null>(null); // State for error messages

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // if (!hasEditPermission) {
    //   setError("You do not have permission to edit this player.");
    //   return;
    // }
    if (!formData.name || isNaN(Number(formData.age))) {
      setError("Invalid data. Please check your inputs.");
      return;
    }
    alert('You must be an admin to edit this player, we will show your changes locally, but it will not be reflected in the database.')
    // setIsFormVisible(false)
    setError(null); // Clear any previous errors
    onSave(formData);
    // onSave(formData);
  };

  return (
    <div>
      {error && (
        <div className="bg-red-500 text-white p-4 rounded mb-4">
          {error}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-6 space-y-4 w-full sm:w-2/3 md:w-1/2 mx-auto"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Player</h2>

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-600"
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-2 border border-gray-300 rounded-lg px-4 py-2 w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Name"
          />
        </div>

        <div>
          <label
            htmlFor="server"
            className="block text-sm font-medium text-gray-600"
          >
            Server
          </label>
          <input
            type="text"
            name="server"
            value={formData.server}
            onChange={handleChange}
            className="mt-2 border border-gray-300 rounded-lg text-black px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Server"
          />
        </div>

        <div>
          <label
            htmlFor="age"
            className="block text-sm font-medium text-gray-600"
          >
            Age
          </label>
          <input
            type="text"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="mt-2 border border-gray-300 rounded-lg text-black px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Age"
          />
        </div>

        <div>
          <label
            htmlFor="earnings"
            className="block text-sm font-medium text-gray-600"
          >
            Earnings
          </label>
          <input
            type="text"
            name="earnings"
            value={formData.earnings}
            onChange={handleChange}
            className="mt-2 border border-gray-300 rounded-lg text-black px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Earnings"
          />
        </div>

        <div className="flex justify-center items-center">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPlayer;
