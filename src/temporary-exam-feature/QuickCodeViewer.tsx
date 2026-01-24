import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Copy, Check, AlertCircle, Loader2 } from 'lucide-react';

export const QuickCodeViewer: React.FC = () => {
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [filename, setFilename] = useState('');

    useEffect(() => {
        const fetchFile = async () => {
            try {
                // Get filename from URL path, removing the leading slash
                const path = window.location.pathname.substring(1);
                // Handle potential URL decoding (e.g. %20 for spaces)
                const decodedPath = decodeURIComponent(path);
                setFilename(decodedPath);

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
            <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <span className="ml-3">Loading file...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
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
        <div className="min-h-screen bg-gray-950 text-gray-200 font-mono">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between shadow-md">
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">File:</span>
                    <span className="font-semibold text-white">{filename}</span>
                </div>
                <button
                    onClick={handleCopy}
                    className={`
                        flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200
                        ${copied
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'}
                    `}
                >
                    {copied ? (
                        <>
                            <Check className="w-4 h-4" />
                            <span>Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-4 h-4" />
                            <span>Copy Content</span>
                        </>
                    )}
                </button>
            </div>

            {/* Content */}
            <div className="p-4 md:p-8 max-w-5xl mx-auto">
                <div className="relative group">
                    <pre className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 overflow-x-auto whitespace-pre-wrap break-words leading-relaxed text-sm md:text-base shadow-inner">
                        <code>{content}</code>
                    </pre>
                </div>
            </div>
        </div>
    );
};
