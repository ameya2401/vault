import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Copy, Check, AlertCircle, Loader2, ZoomIn, ZoomOut, Users } from 'lucide-react';
import Editor from '@monaco-editor/react';

export const QuickCodeViewer: React.FC = () => {
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [filename, setFilename] = useState('');
    const [language, setLanguage] = useState('plaintext');
    const [fontSize, setFontSize] = useState(14);
    
    // For handling conflicts when the same filename exists in multiple groups
    const [conflictFiles, setConflictFiles] = useState<any[]>([]);

    useEffect(() => {
        fetchFileFromUrl();
    }, []);

    const getLanguageFromFilename = (filename: string): string => {
        const ext = filename.split('.').pop()?.toLowerCase();
        switch (ext) {
            case 'js':
            case 'jsx':
                return 'javascript';
            case 'ts':
            case 'tsx':
                return 'typescript';
            case 'py':
                return 'python';
            case 'html':
                return 'html';
            case 'css':
                return 'css';
            case 'json':
                return 'json';
            case 'cpp':
            case 'c':
            case 'h':
                return 'cpp';
            case 'java':
                return 'java';
            case 'sql':
                return 'sql';
            case 'md':
                return 'markdown';
            default:
                return 'plaintext';
        }
    };

    const getGroupInfo = (filePath: string) => {
        if (filePath.startsWith('exam-files/a/')) return { id: 'a', name: 'Group A' };
        if (filePath.startsWith('exam-files/b/')) return { id: 'b', name: 'Group B' };
        if (filePath.startsWith('exam-files/c/')) return { id: 'c', name: 'Group C' };
        if (filePath.startsWith('exam-files/d/')) return { id: 'd', name: 'Group D' };
        
        // Legacy paths
        if (filePath.startsWith('exam-files/group-b/')) return { id: 'b', name: 'Group B' };
        if (filePath.startsWith('exam-files/group-c/')) return { id: 'c', name: 'Group C' };
        if (filePath.startsWith('exam-files/group-d/')) return { id: 'd', name: 'Group D' };
        
        // Fallback for files directly in exam-files/
        if (filePath.startsWith('exam-files/')) return { id: 'a', name: 'Group A' };
        
        return { id: 'unknown', name: 'Unknown Group' };
    };

    const fetchFileFromUrl = async () => {
        try {
            setLoading(true);
            setError(null);
            setConflictFiles([]);

            // Get filename from URL path, removing the leading slash
            const path = window.location.pathname.substring(1);
            const decodedPath = decodeURIComponent(path);
            
            if (!decodedPath) {
                setError('No file specified');
                setLoading(false);
                return;
            }

            // Parse optional group from URL (e.g. "b/file.java")
            let requestedGroup: string | null = null;
            let searchFilename = decodedPath;

            const parts = decodedPath.split('/');
            if (parts.length >= 2) {
                const possibleGroup = parts[0].toLowerCase();
                if (['a', 'b', 'c', 'd'].includes(possibleGroup)) {
                    requestedGroup = possibleGroup;
                    searchFilename = parts.slice(1).join('/');
                }
            }

            setFilename(searchFilename);
            setLanguage(getLanguageFromFilename(searchFilename));

            // Search by name in database
            const { data: files, error: dbError } = await supabase
                .from('files')
                .select('*')
                .ilike('name', searchFilename);

            if (dbError) throw dbError;

            // Filter for exam files
            let examFiles = files?.filter((f: any) => f.file_path.startsWith('exam-files/')) || [];

            // If an exact filename match isn't found, try the flexible extension search
            if (examFiles.length === 0) {
                const { data: extFiles, error: extDbError } = await supabase
                    .from('files')
                    .select('*')
                    .ilike('name', `${searchFilename}.%`);

                if (!extDbError && extFiles) {
                    examFiles = extFiles.filter((f: any) => f.file_path.startsWith('exam-files/'));
                }
            }

            if (examFiles.length === 0) {
                throw new Error('File not found in any exam group.');
            }

            // If a group was specified in the URL, filter specifically for that group
            if (requestedGroup) {
                examFiles = examFiles.filter((f: any) => getGroupInfo(f.file_path).id === requestedGroup);
                if (examFiles.length === 0) {
                    throw new Error(`File not found in ${requestedGroup.toUpperCase()}.`);
                }
            }

            // Exact match resolution (only triggers if NO group was requested AND multiple files exist)
            if (examFiles.length > 1) {
                // We have a conflict! Show disambiguation UI
                setConflictFiles(examFiles);
                setLoading(false);
                return;
            }

            // Exactly one file found
            const targetFile = examFiles[0];
            setFilename(targetFile.name);
            setLanguage(getLanguageFromFilename(targetFile.name));
            
            // Update URL to reflect exact path if it was resolved from ambiguous or no-extension
            const groupInfo = getGroupInfo(targetFile.file_path);
            const newUrl = `/${groupInfo.id}/${targetFile.name}`;
            window.history.replaceState(null, '', newUrl);

            await downloadFile(targetFile.file_path);

        } catch (err: any) {
            console.error('Error fetching file:', err);
            setError(err.message || 'Failed to load file');
            setLoading(false);
        }
    };

    const loadSpecificFile = async (targetFile: any) => {
        try {
            setLoading(true);
            setConflictFiles([]);
            setFilename(targetFile.name);
            setLanguage(getLanguageFromFilename(targetFile.name));
            
            const groupInfo = getGroupInfo(targetFile.file_path);
            const newUrl = `/${groupInfo.id}/${targetFile.name}`;
            window.history.replaceState(null, '', newUrl);

            await downloadFile(targetFile.file_path);
        } catch (err: any) {
            setError(err.message || 'Failed to load file');
            setLoading(false);
        }
    };

    const downloadFile = async (filePath: string) => {
        try {
            const { data, error: downloadError } = await supabase.storage
                .from('files')
                .download(filePath);

            if (downloadError) throw downloadError;

            const text = await data.text();
            setContent(text);
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#1e1e1e] flex items-center justify-center text-white">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <span className="ml-3 font-mono">Loading file...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#1e1e1e] flex items-center justify-center text-white font-mono">
                <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-lg max-w-md text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2">Error</h2>
                    <p className="text-gray-300">{error}</p>
                    <a href="/" className="block mt-6 text-blue-400 hover:text-blue-300 underline">
                        Go to Home
                    </a>
                </div>
            </div>
        );
    }

    if (conflictFiles.length > 0) {
        return (
            <div className="min-h-screen bg-[#1e1e1e] flex items-center justify-center text-white font-mono p-4">
                <div className="bg-[#252526] border border-[#3c3c3c] p-8 rounded-xl max-w-lg w-full shadow-2xl">
                    <div className="flex items-center justify-center mb-6 text-blue-400 bg-blue-400/10 w-16 h-16 rounded-full mx-auto">
                        <Users className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3 text-center text-gray-100">Multiple Files Found</h2>
                    <p className="text-gray-400 text-center mb-8 text-sm">
                        The file <span className="text-blue-400 font-semibold">{filename}</span> exists in multiple groups. 
                        Please select which group you belong to.
                    </p>
                    
                    <div className="space-y-3">
                        {conflictFiles.map((file, index) => {
                            const groupInfo = getGroupInfo(file.file_path);
                            return (
                                <button
                                    key={index}
                                    onClick={() => loadSpecificFile(file)}
                                    className="w-full flex items-center justify-between p-4 rounded-lg border border-[#3c3c3c] bg-[#1e1e1e] hover:bg-[#2d2d2d] hover:border-blue-500/50 transition-all text-left group"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-lg font-bold text-gray-200 group-hover:text-blue-400 transition-colors">
                                            {groupInfo.name}
                                        </span>
                                        <span className="text-xs text-gray-500 mt-1 truncate max-w-[200px] sm:max-w-[300px]">
                                            {file.file_path}
                                        </span>
                                    </div>
                                    <div className="text-gray-600 group-hover:text-blue-400">
                                        →
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-[#3c3c3c] text-center">
                        <a href="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                            Return to Home
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-screen bg-[#1e1e1e] text-gray-200 font-mono flex flex-col">
            {/* Header */}
            <div className="bg-[#2d2d2d] border-b border-[#1e1e1e] px-6 py-3 grid grid-cols-3 items-center shadow-sm shrink-0">
                {/* Left: Filename */}
                <div className="flex items-center space-x-3 justify-start">
                    <span className="text-gray-400">File:</span>
                    <span className="font-semibold text-gray-200 text-lg truncate">{filename}</span>
                </div>

                {/* Center: Zoom Controls */}
                <div className="flex items-center justify-center">
                    <div className="flex items-center bg-[#3c3c3c] rounded-md overflow-hidden border border-[#4a4a4a] shadow-sm transform scale-110">
                        <button
                            onClick={() => setFontSize(prev => Math.max(10, prev - 1))}
                            className="p-3 hover:bg-[#4a4a4a] text-gray-300 transition-colors active:bg-[#5a5a5a]"
                            title="Decrease font size"
                        >
                            <ZoomOut className="w-6 h-6" />
                        </button>
                        <span className="px-4 text-base font-medium text-gray-300 min-w-[3ch] text-center border-x border-[#4a4a4a] py-3 bg-[#333]">
                            {fontSize}
                        </span>
                        <button
                            onClick={() => setFontSize(prev => Math.min(32, prev + 1))}
                            className="p-3 hover:bg-[#4a4a4a] text-gray-300 transition-colors active:bg-[#5a5a5a]"
                            title="Increase font size"
                        >
                            <ZoomIn className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Right: Copy Button */}
                <div className="flex items-center justify-end">
                    <button
                        onClick={handleCopy}
                        className={`
                            flex items-center space-x-2 px-6 py-3 rounded-md text-base font-medium transition-all duration-200 shadow-lg
                            ${copied
                                ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                                : 'bg-[#007acc] hover:bg-[#0063a5] text-white hover:shadow-blue-500/20 border border-transparent'}
                        `}
                    >
                        {copied ? (
                            <>
                                <Check className="w-5 h-5" />
                                <span>Copied</span>
                            </>
                        ) : (
                            <>
                                <Copy className="w-5 h-5" />
                                <span>Copy Code</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Monaco Editor Container */}
            <div className="flex-1 overflow-hidden">
                <Editor
                    height="100%"
                    width="100%"
                    language={language}
                    value={content}
                    theme="vs-dark"
                    options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: fontSize,
                        fontFamily: "'Cascadia Code', 'Fira Code', 'Menlo', 'Monaco', 'Courier New', monospace",
                        fontLigatures: true,
                        padding: { top: 24, bottom: 24 },
                        lineNumbers: 'on',
                        renderLineHighlight: 'all',
                        contextmenu: false,
                        matchBrackets: 'always',
                        automaticLayout: true,
                        mouseWheelZoom: false,
                    }}
                />
            </div>
        </div>
    );
};

