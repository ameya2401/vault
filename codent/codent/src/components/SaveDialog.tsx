import { useState } from 'react';
import { X } from 'lucide-react';
import { CategoryType } from '../types';

interface SaveDialogProps {
  onSave: (title: string, category: string) => void;
  onClose: () => void;
}

const CATEGORIES = ['DSA', 'WebTech', 'DBMS', 'Uncategorized'];

export default function SaveDialog({ onSave, onClose }: SaveDialogProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Uncategorized');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(title || 'Untitled', category);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center px-4 z-50">
      <div className="bg-white max-w-md w-full p-6 border-4 border-black">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black font-['Poppins']">
            Save Code Snippet
          </h2>
          <button
            onClick={onClose}
            className="text-black hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-black font-semibold mb-2 font-['Poppins']">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title (optional)"
              className="w-full px-4 py-2 border-2 border-black focus:outline-none font-['Poppins']"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-black font-semibold mb-2 font-['Poppins']">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border-2 border-black focus:outline-none font-['Poppins']"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-black text-white font-semibold hover:bg-gray-800 transition-colors font-['Poppins']"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-black text-black font-semibold hover:bg-gray-100 transition-colors font-['Poppins']"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
