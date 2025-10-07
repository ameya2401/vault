import { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Copy, Save, X, Plus } from 'lucide-react';
import { OpenFile } from '../types';

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

  const activeFile = openFiles.find(file => file.id === activeFileId) || openFiles[0];

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleCopy = async () => {
    if (!activeFile) return;
    try {
      await navigator.clipboard.writeText(activeFile.code_content);
      alert('Code copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black rounded-lg overflow-hidden border border-gray-800">
      {/* File Tabs - Black and White Minimal */}
      <div className="flex bg-black border-b border-gray-800 overflow-x-auto">
        {openFiles.map((file) => (
          <div
            key={file.id}
            className={`flex items-center px-4 py-3 cursor-pointer border-r border-gray-800 relative group min-w-[120px] ${
              activeFileId === file.id
                ? 'bg-white text-black'
                : 'bg-black text-white hover:bg-gray-900'
            }`}
            onClick={() => onFileSelect(file.id)}
          >
            <span className="mr-2 text-sm truncate max-w-xs font-['Poppins']">{file.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFileClose(file.id);
              }}
              className={`opacity-0 group-hover:opacity-100 rounded-full p-1 transition-opacity ${
                activeFileId === file.id ? 'hover:bg-gray-300' : 'hover:bg-gray-800'
              }`}
            >
              <X size={14} />
            </button>
            {activeFileId === file.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
            )}
          </div>
        ))}
        <button
          onClick={onAddNewFile}
          className="px-4 py-3 text-white hover:text-gray-300 hover:bg-gray-900 flex items-center"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Editor - Black and White Minimal */}
      <div className="flex-1 bg-black p-4" style={{ height: '65vh' }}>
        {activeFile && (
          <div className="h-full rounded-lg overflow-hidden border border-gray-800">
            <Editor
              height="100%"
              defaultLanguage={activeFile.language || 'java'}
              value={activeFile.code_content}
              onChange={(value) => onCodeChange(activeFile.id, value || '')}
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
                },
                smoothScrolling: true,
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: 'on',
                scrollbar: {
                  vertical: 'auto',
                  horizontal: 'auto'
                }
              }}
            />
          </div>
        )}
      </div>

      {/* Action Buttons - Black and White Minimal */}
      <div className="flex gap-3 p-4 bg-black border-t border-gray-800">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black font-medium hover:bg-gray-200 transition-colors rounded font-['Poppins'] border border-gray-300"
        >
          <Copy size={16} />
          Copy
        </button>

        <button
          onClick={onSave}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black font-medium hover:bg-gray-200 transition-colors rounded font-['Poppins'] border border-gray-300"
        >
          <Save size={16} />
          Save
        </button>
      </div>
    </div>
  );
}