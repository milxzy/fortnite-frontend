import { useState } from 'react'
import { Player } from '../types/types'

interface EditPlayerProps {
    player: Player;
    onSave: (updatedPlayer: Player) => void;
}

const EditPlayer: React.FC<EditPlayerProps> = ({ player, onSave }) => {
    const [formData, setFormData] = useState<Player>(player);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value}))
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSave(formData);
    }
  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
        <input type="text" 
        name='name'
        value={formData.name}
        onChange={handleChange}
        className='border rounded px-4 py-2 w-full'
        placeholder='name'
        />
        <input type="text"
        name='posistion'
        value={formData.team}
        onChange={handleChange} 
        className='border rounded px-4 py -2 w-full'
        placeholder='posistion'
        />
        <button type='submit' className="bg-green-500 text-white px-4 py-2 rounded">
            Save
        </button>
    </form>
  )
}

export default EditPlayer