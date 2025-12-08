import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Copy, Save, X, Plus } from 'lucide-react';
import { OpenFile } from '../../types/code';
import { detectLanguage } from '../../lib/languageDetection';

interface MultiTabCodeEditorProps {
  openFiles: OpenFile[];
  activeFileId: string;
  onCodeChange: (fileId: string, code: string) => void;
  onFileClose: (fileId: string) => void;
  onFileSelect: (fileId: string) => void;
  onSave: () => void;
  onAddNewFile: () => void;
}

export default function MultiTabCodeEditor({
  openFiles,
  activeFileId,
  onCodeChange,
  onFileClose,
  onFileSelect,
  onSave,
  onAddNewFile
}: MultiTabCodeEditorProps) {
  const editorRef = useRef<any>(null);
  const [detectedLanguage, setDetectedLanguage] = useState<string>('');

  const activeFile = openFiles.find(file => file.id === activeFileId) || openFiles[0];

  // Ensure the active file has content
  const editorValue = activeFile?.code_content || '';

  // Determine the language based on file extension or default to SQL
  const editorLanguage = activeFile?.language || 'sql';

  // Detect language when code changes
  useEffect(() => {
    if (editorValue) {
      const detected = detectLanguage(editorValue);
      setDetectedLanguage(detected);
    }
  }, [editorValue]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    console.log('Editor mounted:', editor);
  };

  const handleEditorChange = (value: string | undefined) => {
    console.log('Editor value changed:', value);
    const newValue = value || '';
    
    // Detect language from the new code
    const detected = detectLanguage(newValue);
    setDetectedLanguage(detected);
    
    onCodeChange(activeFile.id, newValue);
  };

  const handleCopy = async () => {
    if (!activeFile) return;
    try {
      await navigator.clipboard.writeText(activeFile.code_content);
      // Show a simple alert instead of a custom notification
      alert('Code copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
      {/* File Tabs */}
      <div className="flex bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
        {openFiles.map((file) => (
          <div
            key={file.id}
            className={`flex items-center px-4 py-3 cursor-pointer border-r border-gray-200 dark:border-gray-800 relative group min-w-[120px] ${
              activeFileId === file.id
                ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white'
                : 'bg-white dark:bg-black text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900'
            }`}
            onClick={() => onFileSelect(file.id)}
          >
            <span className="mr-2 text-sm truncate max-w-xs">{file.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFileClose(file.id);
              }}
              className={`opacity-0 group-hover:opacity-100 rounded-full p-1 transition-opacity ${
                activeFileId === file.id ? 'hover:bg-gray-300 dark:hover:bg-gray-700' : 'hover:bg-gray-200 dark:hover:bg-gray-800'
              }`}
            >
              <X size={14} />
            </button>
            {activeFileId === file.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white"></div>
            )}
          </div>
        ))}
        <button
          onClick={onAddNewFile}
          className="px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 flex items-center"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Editor */}
      <div style={{ height: '500px', padding: '1rem' }} className="bg-white dark:bg-black">
        <div style={{ height: '100%', border: '1px solid #e5e7eb' }} className="dark:border-gray-800 rounded-lg overflow-hidden">
          <Editor
            height="100%"
            defaultLanguage={detectedLanguage || editorLanguage}
            language={detectedLanguage || editorLanguage}
            value={editorValue}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              autoIndent: 'full',
              formatOnType: true,
              formatOnPaste: true,
              matchBrackets: 'always',
              bracketPairColorization: { enabled: true },
              padding: { top: 16, bottom: 16 },
              smoothScrolling: true,
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              scrollbar: {
                vertical: 'visible',
                horizontal: 'auto',
                handleMouseWheel: true,
                useShadows: false,
                alwaysConsumeMouseWheel: false
              },
              // Disable validation to remove error underlines
              quickSuggestions: true,
              suggestOnTriggerCharacters: true,
              wordBasedSuggestions: "currentDocument",
              hover: { enabled: false },
              occurrencesHighlight: "off",
              renderLineHighlight: "none",
              selectionHighlight: false,
              guides: {
                bracketPairs: false,
                bracketPairsHorizontal: false,
                highlightActiveBracketPair: false,
                highlightActiveIndentation: false,
                indentation: false
              }
            }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 p-4 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors rounded"
        >
          <Copy size={16} />
          Copy
        </button>

        <button
          onClick={onSave}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors rounded"
        >
          <Save size={16} />
          Save
        </button>
      </div>
    </div>
  );
}