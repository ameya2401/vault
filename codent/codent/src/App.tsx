import { useState, useEffect } from 'react';
import Login from './components/Login';
import Navigation from './components/Navigation';
import CodeEditor from './components/CodeEditor';
import MultiTabCodeEditor from './components/MultiTabCodeEditor';
import SavedFiles from './components/SavedFiles';
import SaveDialog from './components/SaveDialog';
import { TabType, CodeSnippet, OpenFile } from './types';
import { codeService } from './services/codeService';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('editor');
  const [code, setCode] = useState('');
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  // New state for multiple file tabs
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([
    { id: 'default', title: 'Code 1', code_content: '', language: 'java' }
  ]);
  const [activeFileId, setActiveFileId] = useState('default');

  useEffect(() => {
    // Load snippets from Supabase when component mounts
    loadSnippets();
  }, []);

  const loadSnippets = async () => {
    try {
      const savedSnippets = await codeService.getCodeSnippets();
      setSnippets(savedSnippets);
    } catch (err) {
      console.error('Error loading snippets:', err);
      // Fallback to localStorage if Supabase fails
      const localSnippets = localStorage.getItem('codeSnippets');
      if (localSnippets) {
        setSnippets(JSON.parse(localSnippets));
      }
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
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

      // Save to Supabase
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
      // Delete from Supabase
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
      setOpenFiles([{ id: 'default', title: 'Code 1', code_content: '', language: 'java' }]);
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
      code_content: '',
      language: 'java'
    };
    setOpenFiles([...openFiles, newFile]);
    setActiveFileId(newFileId);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-black flex flex-col" style={{ height: '100vh' }}>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} />

      <main className="flex-1 container mx-auto px-6 py-8" style={{ height: 'calc(100vh - 100px)' }}>
        {activeTab === 'editor' && (
          <MultiTabCodeEditor
            openFiles={openFiles}
            activeFileId={activeFileId}
            onCodeChange={handleCodeChange}
            onFileClose={handleCloseFile}
            onFileSelect={handleFileSelect}
            onSave={() => setShowSaveDialog(true)}
            onAddNewFile={handleAddNewFile}
          />
        )}

        {activeTab === 'indenter' && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4 font-['Poppins']">
                Code Indenter
              </h2>
              <p className="text-gray-400 font-['Poppins']">
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

      {/* Cute Footer */}
      <footer className="py-4 text-center bg-black border-t border-gray-800">
        <div className="container mx-auto px-6">
          <p className="text-gray-400 font-['Poppins'] text-sm">
            Made with <span className="text-pink-500">❤</span> by Ameya Bhagat
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;