import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Copy, Check, AlertCircle, Loader2 } from 'lucide-react';
import Editor from '@monaco-editor/react';

export const QuickCodeViewer: React.FC = () => {
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [filename, setFilename] = useState('');
    const [language, setLanguage] = useState('plaintext');

    useEffect(() => {
        const fetchFile = async () => {
            try {
                // Get filename from URL path, removing the leading slash
                const path = window.location.pathname.substring(1);
                // Handle potential URL decoding (e.g. %20 for spaces)
                const decodedPath = decodeURIComponent(path);
                setFilename(decodedPath);
                setLanguage(getLanguageFromFilename(decodedPath));

                if (!decodedPath) {
                    setError('No file specified');
                    setLoading(false);
                    return;
                }

                // 1. First find the file in the database to get its path
                // We search by name (flexible search primarily for exact match)
                const { data: files, error: dbError } = await supabase
                    .from('files')
                    .select('*')
                    .ilike('name', decodedPath);

                if (dbError) throw dbError;

                // FILTER: Only allow files in the exam-files/ folder
                let targetFile = files?.find((f: any) => f.file_path.startsWith('exam-files/'));

                if (!targetFile) {
                    // Try adding .txt extension if not found
                    if (!decodedPath.endsWith('.txt')) {
                        const { data: txtFiles, error: txtDbError } = await supabase
                            .from('files')
                            .select('*')
                            .ilike('name', `${decodedPath}.txt`);

                        if (!txtDbError && txtFiles) {
                            targetFile = txtFiles.find((f: any) => f.file_path.startsWith('exam-files/'));
                        }
                    }
                }

                if (!targetFile) {
                    throw new Error('File not found');
                }

                await downloadFile(targetFile.file_path);

            } catch (err: any) {
                console.error('Error fetching file:', err);
                setError(err.message || 'Failed to load file');
            } finally {
                setLoading(false);
            }
        };

        fetchFile();
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

    return (
        <div className="h-screen w-screen bg-[#1e1e1e] text-gray-200 font-mono flex flex-col">
            {/* Header */}
            <div className="bg-[#2d2d2d] border-b border-[#1e1e1e] px-4 py-2 flex items-center justify-between shadow-sm shrink-0">
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">File:</span>
                    <span className="font-semibold text-gray-200">{filename}</span>
                </div>
                <button
                    onClick={handleCopy}
                    className={`
                        flex items-center space-x-2 px-3 py-1.5 rounded text-sm transition-all duration-200
                        ${copied
                            ? 'bg-green-600/20 text-green-400'
                            : 'bg-[#007acc] hover:bg-[#0063a5] text-white'}
                    `}
                >
                    {copied ? (
                        <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                        </>
                    )}
                </button>
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
                        fontSize: 14,
                        fontFamily: "'Cascadia Code', 'Fira Code', 'Menlo', 'Monaco', 'Courier New', monospace",
                        fontLigatures: true,
                        padding: { top: 16, bottom: 16 },
                        lineNumbers: 'on',
                        renderLineHighlight: 'all',
                        contextmenu: false,
                        matchBrackets: 'always',
                        automaticLayout: true,
                    }}
                />
            </div>
        </div>
    );
};
