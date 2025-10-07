import { useState, useEffect } from 'react';
import Navigation from './Navigation';
import MultiTabCodeEditor from './MultiTabCodeEditor';
import SavedFiles from './SavedFiles';
import SaveDialog from './SaveDialog';
import { TabType, CodeSnippet, OpenFile } from '../../types/code';
import { codeService } from '../../lib/codeService';

export default function CodeEditor() {
  const [activeTab, setActiveTab] = useState<TabType>('editor');
  const [code, setCode] = useState('');
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  // New state for multiple file tabs
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([
    { id: 'default', title: 'Code 1', code_content: '// Type your code here...', language: 'javascript' }
  ]);
  const [activeFileId, setActiveFileId] = useState('default');

  useEffect(() => {
    // Load snippets from storage when component mounts
    loadSnippets();
  }, []);

  const loadSnippets = async () => {
    try {
      const savedSnippets = await codeService.getCodeSnippets();
      setSnippets(savedSnippets);
    } catch (err) {
      console.error('Error loading snippets:', err);
      // Fallback to localStorage if service fails
      const localSnippets = localStorage.getItem('codeSnippets');
      if (localSnippets) {
        setSnippets(JSON.parse(localSnippets));
      }
    }
  };

  const handleSave = async (title: string, category: string) => {
    const activeFile = openFiles.find(file => file.id === activeFileId);
    if (!activeFile) return;

    try {
      const newSnippet: CodeSnippet = {
        id: crypto.randomUUID(),
        code_content: activeFile.code_content,
        title,
        category,
        language: activeFile.language,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Save to service
      const savedSnippet = await codeService.saveCodeSnippet(newSnippet);
      
      // Update local state
      const updatedSnippets = [...snippets, savedSnippet];
      setSnippets(updatedSnippets);
      setShowSaveDialog(false);
      alert('Code saved successfully!');
    } catch (err) {
      console.error('Error saving snippet:', err);
      alert('Error saving code snippet. Please try again.');
    }
  };

  const handleView = (snippet: CodeSnippet) => {
    // Check if file is already open
    const existingFile = openFiles.find(file => file.id === snippet.id);
    if (existingFile) {
      setActiveFileId(snippet.id);
    } else {
      // Add snippet as a new open file
      const newFile: OpenFile = {
        id: snippet.id,
        title: snippet.title,
        code_content: snippet.code_content,
        language: snippet.language
      };
      setOpenFiles([...openFiles, newFile]);
      setActiveFileId(snippet.id);
    }
    setActiveTab('editor');
  };

  const handleDelete = async (id: string) => {
    try {
      // Delete from service
      await codeService.deleteCodeSnippet(id);
      
      // Update local state
      const updatedSnippets = snippets.filter(s => s.id !== id);
      setSnippets(updatedSnippets);
    } catch (err) {
      console.error('Error deleting snippet:', err);
      alert('Error deleting code snippet. Please try again.');
    }
  };

  // Handle code change for a specific file
  const handleCodeChange = (fileId: string, newCode: string) => {
    setOpenFiles(prevFiles => 
      prevFiles.map(file => 
        file.id === fileId ? { ...file, code_content: newCode } : file
      )
    );
    // If this is the active file, also update the code state
    if (fileId === activeFileId) {
      setCode(newCode);
    }
  };

  // Handle selecting a different file tab
  const handleFileSelect = (fileId: string) => {
    setActiveFileId(fileId);
    // Find the selected file and update the code state
    const selectedFile = openFiles.find(file => file.id === fileId);
    if (selectedFile) {
      setCode(selectedFile.code_content);
    }
  };

  // Handle closing a file tab
  const handleCloseFile = (fileId: string) => {
    if (openFiles.length <= 1) {
      // Don't close the last file, just clear it
      setOpenFiles([{ id: 'default', title: 'Code 1', code_content: '// Type your code here...', language: 'javascript' }]);
      setActiveFileId('default');
      return;
    }

    const updatedFiles = openFiles.filter(file => file.id !== fileId);
    setOpenFiles(updatedFiles);
    
    // If we closed the active file, switch to the first available file
    if (fileId === activeFileId) {
      setActiveFileId(updatedFiles[0].id);
    }
    
    // Renumber the files to maintain Code 1, Code 2, etc.
    const renumberedFiles = updatedFiles.map((file, index) => ({
      ...file,
      title: file.title.startsWith('Code ') ? `Code ${index + 1}` : file.title
    }));
    
    // Only update if titles actually changed
    if (renumberedFiles.some((file, i) => file.title !== updatedFiles[i].title)) {
      setOpenFiles(renumberedFiles);
    }
  };

  // Handle adding a new file
  const handleAddNewFile = () => {
    const newFileId = `file-${Date.now()}`;
    // Count existing "Code" files to determine the next number
    const codeFileCount = openFiles.filter(file => file.title.startsWith('Code ')).length;
    const newFile: OpenFile = {
      id: newFileId,
      title: `Code ${codeFileCount + 1}`,
      code_content: '// Type your code here...',
      language: 'javascript'
    };
    setOpenFiles([...openFiles, newFile]);
    setActiveFileId(newFileId);
  };

  return (
    <div className="h-full w-full bg-white dark:bg-black flex flex-col">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 w-full px-4 py-6">
        {activeTab === 'editor' && (
          <div className="h-full w-full">
            <MultiTabCodeEditor
              openFiles={openFiles}
              activeFileId={activeFileId}
              onCodeChange={handleCodeChange}
              onFileClose={handleCloseFile}
              onFileSelect={handleFileSelect}
              onSave={() => setShowSaveDialog(true)}
              onAddNewFile={handleAddNewFile}
            />
          </div>
        )}

        {activeTab === 'indenter' && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-xl font-bold text-black dark:text-white mb-2">
                Code Indenter
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Coming soon - Format and indent your code automatically
              </p>
            </div>
          </div>
        )}

        {activeTab === 'saved' && (
          <SavedFiles
            snippets={snippets}
            onView={handleView}
            onDelete={handleDelete}
          />
        )}
      </main>

      {showSaveDialog && (
        <SaveDialog
          onSave={handleSave}
          onClose={() => setShowSaveDialog(false)}
        />
      )}
    </div>
  );
}