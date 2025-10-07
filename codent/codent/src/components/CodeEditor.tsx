import { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Copy, Save } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  onSave: () => void;
}

export default function CodeEditor({ code, onChange, onSave }: CodeEditorProps) {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      alert('Code copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 border border-gray-700 rounded-lg overflow-hidden m-4" style={{ height: '70vh' }}>
        <Editor
          height="100%"
          defaultLanguage="java"
          value={code}
          onChange={(value) => onChange(value || '')}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 16,
            fontFamily: "'Poppins', monospace",
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            autoIndent: 'full',
            formatOnType: true,
            formatOnPaste: true,
            matchBrackets: 'always',
            bracketPairColorization: {
              enabled: true
            },
            padding: {
              top: 20,
              bottom: 20
            }
          }}
        />
      </div>

      <div className="flex gap-4 m-4">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white font-medium hover:bg-gray-700 transition-colors rounded font-['Poppins']"
        >
          <Copy size={16} />
          Copy
        </button>

        <button
          onClick={onSave}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white font-medium hover:bg-gray-700 transition-colors rounded font-['Poppins']"
        >
          <Save size={16} />
          Save
        </button>
      </div>
    </div>
  );
}