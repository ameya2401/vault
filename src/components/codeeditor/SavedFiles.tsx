import { useState } from 'react';
import { CodeSnippet } from '../../types/code';
import { Trash2, Eye } from 'lucide-react';

interface SavedFilesProps {
  snippets: CodeSnippet[];
  onView: (snippet: CodeSnippet) => void;
  onDelete: (id: string) => void;
}

export default function SavedFiles({ snippets, onView, onDelete }: SavedFilesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Get unique categories from snippets
  const categories = ['All', ...new Set(snippets.map(snippet => snippet.category || 'Uncategorized'))];
  
  // Filter snippets by selected category
  const filteredSnippets = selectedCategory === 'All' 
    ? snippets 
    : snippets.filter(snippet => (snippet.category || 'Uncategorized') === selectedCategory);

  return (
    <div className="bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <h2 className="text-xl font-bold text-black dark:text-white mb-4">Saved Code Snippets</h2>
      
      {/* Category Filter */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                selectedCategory === category
                  ? 'bg-black dark:bg-white text-white dark:text-black'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}
      
      {filteredSnippets.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            {selectedCategory === 'All' 
              ? 'No saved code snippets yet.' 
              : `No saved code snippets in the "${selectedCategory}" category.`}
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
            Write some code in the editor and save it to see it here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSnippets.map((snippet) => (
            <div 
              key={snippet.id} 
              className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-black dark:text-white">{snippet.title}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(snippet.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {snippet.category && snippet.category !== 'Uncategorized' && (
                    <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded mt-2 inline-block">
                      {snippet.category}
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => onView(snippet)}
                    className="p-1 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                    title="View"
                  >
                    <Eye size={16} />
                  </button>
                  <button 
                    onClick={() => onDelete(snippet.id)}
                    className="p-1 text-gray-600 dark:text-gray-400 hover:text-red-500"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}