import { useState } from 'react';
import { Copy, Trash2, Eye, Filter } from 'lucide-react';
import { CodeSnippet, CategoryType } from '../types';

interface SavedFilesProps {
  snippets: CodeSnippet[];
  onView: (snippet: CodeSnippet) => void;
  onDelete: (id: string) => void;
}

const CATEGORIES: CategoryType[] = ['All', 'DSA', 'WebTech', 'DBMS', 'Uncategorized'];

export default function SavedFiles({ snippets, onView, onDelete }: SavedFilesProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');

  const filteredSnippets = selectedCategory === 'All'
    ? snippets
    : snippets.filter(s => s.category === selectedCategory);

  const sortedSnippets = [...filteredSnippets].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      alert('Code copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-4 mb-6">
        <Filter size={20} className="text-white" />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as CategoryType)}
          className="px-4 py-2 bg-white text-black border-2 border-gray-800 focus:border-white focus:outline-none font-['Poppins']"
        >
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <span className="text-gray-400 font-['Poppins']">
          {sortedSnippets.length} snippet{sortedSnippets.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {sortedSnippets.length === 0 ? (
          <div className="text-center text-gray-500 mt-12 font-['Poppins']">
            <p>No saved snippets yet</p>
            <p className="text-sm mt-2">Save some code from the editor to see it here</p>
          </div>
        ) : (
          sortedSnippets.map(snippet => (
            <div
              key={snippet.id}
              className="border-2 border-gray-800 bg-black p-4 hover:border-white transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="text-white font-semibold font-['Poppins'] text-lg">
                    {snippet.title}
                  </h3>
                  <p className="text-gray-500 text-sm font-['Poppins']">
                    {formatDate(snippet.created_at)}
                  </p>
                </div>
                <span className="px-3 py-1 bg-white text-black text-xs font-semibold font-['Poppins']">
                  {snippet.category}
                </span>
              </div>

              <div className="bg-gray-900 p-3 rounded mb-3 max-h-32 overflow-hidden">
                <pre className="text-gray-300 text-sm font-mono line-clamp-4">
                  {snippet.code_content}
                </pre>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onView(snippet)}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-semibold hover:bg-gray-200 transition-colors font-['Poppins']"
                >
                  <Eye size={16} />
                  View
                </button>
                <button
                  onClick={() => handleCopy(snippet.code_content)}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-semibold hover:bg-gray-200 transition-colors font-['Poppins']"
                >
                  <Copy size={16} />
                  Copy
                </button>
                <button
                  onClick={() => {
                    if (confirm('Delete this snippet?')) {
                      onDelete(snippet.id);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors font-['Poppins']"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
