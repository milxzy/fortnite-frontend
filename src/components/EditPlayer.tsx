import { useState } from "react";
import { Player } from "../types/types";

interface EditPlayerProps {
  player: Player;
  onSave: (updatedPlayer: Player) => void;
}

const EditPlayer: React.FC<EditPlayerProps> = ({ player, onSave }) => {
  const [formData, setFormData] = useState<Player>(player);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-6 space-y-4 w-full sm:w-2/3 md:w1/2 mx-auto"
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
          placeholder="name"
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
          className="mt-2 border border-gray-300 rounded-lg  text-black px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="mt-2 border border-gray-300 rounded-lg  text-black px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Age"
        />
      </div>
<div>
        <label
          htmlFor="age"
          className="block text-sm font-medium text-gray-600"
        >
          Earnings
        </label>
        <input
          type="text"
          name="earnings"
          value={formData.earnings}
          onChange={handleChange}
          className="mt-2 border border-gray-300 rounded-lg  text-black px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Earnings"
        />
      </div>
      <div className="flex justify-center content-center items-center">
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default EditPlayer;
