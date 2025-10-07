import { CodeSnippet } from '../../types/code';
import { Trash2, Eye } from 'lucide-react';

interface SavedFilesProps {
  snippets: CodeSnippet[];
  onView: (snippet: CodeSnippet) => void;
  onDelete: (id: string) => void;
}

export default function SavedFiles({ snippets, onView, onDelete }: SavedFilesProps) {
  return (
    <div className="bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <h2 className="text-xl font-bold text-black dark:text-white mb-4">Saved Code Snippets</h2>
      
      {snippets.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">No saved code snippets yet.</p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
            Write some code in the editor and save it to see it here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {snippets.map((snippet) => (
            <div 
              key={snippet.id} 
              className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-black dark:text-white">{snippet.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {snippet.language} • {new Date(snippet.created_at).toLocaleDateString()}
                  </p>
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
              <div className="mt-3">
                <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-hidden text-ellipsis whitespace-nowrap">
                  {snippet.code_content.substring(0, 100)}...
                </pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}