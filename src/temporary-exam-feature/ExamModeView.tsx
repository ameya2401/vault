import React, { useState, useEffect } from 'react';
import { FileUpload } from '../components/FileUpload';
import { FileList } from '../components/FileList';
import { UploadedFile } from '../types/file';
import { storageService } from '../lib/storage';
import { AlertTriangle, Search, Trash2, Link } from 'lucide-react';

interface ExamModeViewProps {
    onPreview: (file: UploadedFile) => void;
    onDownload: (file: UploadedFile) => void;
    onDelete: (file: UploadedFile) => void;
}

export const ExamModeView: React.FC<ExamModeViewProps> = ({
    onPreview,
    onDownload,
    onDelete
}) => {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [filteredFiles, setFilteredFiles] = useState<UploadedFile[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    const EXAM_ROOT = 'exam-files';
    const tabs = [
        { id: 'a', label: 'Group A', folder: `${EXAM_ROOT}/a` },
        { id: 'b', label: 'Group B', folder: `${EXAM_ROOT}/b` },
        { id: 'c', label: 'Group C', folder: `${EXAM_ROOT}/c` },
        { id: 'd', label: 'Group D', folder: `${EXAM_ROOT}/d` }
    ];
    const [activeTabId, setActiveTabId] = useState(tabs[0].id);
    const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];

    useEffect(() => {
        loadFiles(activeTab.folder);
    }, [activeTab.folder]);

    useEffect(() => {
        const filtered = files.filter(file =>
            file.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredFiles(filtered);
    }, [files, searchQuery]);

    const loadFiles = async (folder: string) => {
        try {
            setLoading(true);
            const loadedFiles = await storageService.getFiles(folder);
            setFiles(loadedFiles);
        } catch (error) {
            console.error('Error loading exam files:', error);
            alert('Failed to load exam files');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (file: File) => {
        setUploading(true);
        try {
            const uploadedFile = await storageService.uploadFile(file, activeTab.folder);
            setFiles(prev => [uploadedFile, ...prev]);
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload file. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleFileDelete = async (file: UploadedFile) => {
        const isConfirmed = window.confirm(`Are you sure you want to delete "${file.name}" from Exam Mode?`);
        if (!isConfirmed) return;

        try {
            await storageService.deleteFile(file);
            const updatedFiles = files.filter(f => f.id !== file.id);
            setFiles(updatedFiles);
            onDelete(file);
        } catch (error) {
            console.error('Error deleting file:', error);
            alert('Failed to delete file');
        }
    }

    const handleDeleteAll = async () => {
        if (files.length === 0) return;

        const isConfirmed = window.confirm(
            "WARNING: You are about to DELETE ALL files in Exam Mode.\n\nThis action cannot be undone.\n\nAre you sure you want to proceed?"
        );
        if (!isConfirmed) return;

        const password = window.prompt("Please enter the admin password to confirm deletion:");
        if (!password) return;

        const CORRECT_PASSWORD = import.meta.env.VITE_APP_PASSWORD || 'Ab@supabase';
        const TEST_PASSWORD = 'test123';

        if (password !== CORRECT_PASSWORD && password !== TEST_PASSWORD) {
            alert("Incorrect password. Deletion cancelled.");
            return;
        }

        try {
            setLoading(true);
            const deletePromises = files.map(file => storageService.deleteFile(file));
            await Promise.all(deletePromises);
            setFiles([]);
            setFilteredFiles([]);
        } catch (error) {
            console.error('Error deleting all files:', error);
            alert('Failed to delete some files. Please check console for details.');
            loadFiles(activeTab.folder);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto w-full flex flex-col lg:flex-row gap-8 lg:gap-12 pb-8 h-[calc(100vh-8rem)] min-h-[700px] items-start px-4 sm:px-6 lg:px-8">
            
            {/* Left Column: Fixed Config & Upload Panel */}
            <div className="w-full lg:w-[420px] flex-shrink-0 flex flex-col space-y-8">
                
                {/* Header Area */}
                <div className="flex flex-col items-start pt-4">
                    <div className="inline-flex items-center space-x-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide mb-4">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Exam Mode Sandbox</span>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
                        Workspace
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                        Upload and manage secure files. Students access these files using a direct routing link for practical exams.
                    </p>
                </div>

                {/* Elegant Tab Switcher */}
                <div>
                    <div className="inline-flex p-1 bg-gray-100/80 dark:bg-[#1a1a1a] rounded-xl shadow-inner border border-gray-200 dark:border-white/5 w-full">
                        {tabs.map((tab) => {
                            const isActive = activeTabId === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTabId(tab.id)}
                                    className={`
                                        flex-1 relative flex items-center justify-center py-2 rounded-lg text-sm font-medium transition-all duration-300 outline-none
                                        ${isActive 
                                            ? 'text-gray-900 dark:text-white shadow-sm bg-white dark:bg-[#2d2d2d] border border-gray-200 dark:border-white/10' 
                                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-white/5 border border-transparent'
                                        }
                                    `}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Intelligent Helper Alert */}
                <div className="flex items-start space-x-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl p-4 shadow-sm">
                    <div className="p-2 bg-white dark:bg-[#2d2d2d] rounded-lg border border-gray-200 dark:border-white/5 shadow-sm mt-0.5">
                        <Link className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 flex flex-col">
                        <span className="font-medium text-gray-900 dark:text-gray-200 mb-1">Direct access link</span>
                        <span className="font-mono text-xs break-all bg-gray-200 dark:bg-[#2d2d2d] px-2 py-1 rounded inline-block self-start">
                            /{activeTab.id}/filename
                        </span>
                    </div>
                </div>

                {/* Upload Area */}
                <div>
                    <FileUpload onFileUpload={handleFileUpload} uploading={uploading} />
                </div>
            </div>

            {/* Right Column: Scrollable File Manager */}
            <div className="flex-1 w-full flex flex-col h-full bg-white dark:bg-[#111111] rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden">
                
                {/* Fixed Search/Actions Header */}
                <div className="p-6 border-b border-gray-100 dark:border-white/5 flex-shrink-0 flex items-center gap-3 bg-white/50 dark:bg-[#111111]/50 backdrop-blur-md z-10">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-colors group-focus-within:text-blue-500" />
                        <input
                            type="text"
                            placeholder="Filter files in this group..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all placeholder:text-gray-400"
                        />
                    </div>
                    {files.length > 0 && (
                        <button
                            onClick={handleDeleteAll}
                            className="px-4 py-2 bg-transparent border border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-red-500/30"
                        >
                            <Trash2 className="w-4 h-4" />
                            Clear List
                        </button>
                    )}
                </div>

                {/* Scrollable List Body */}
                <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full opacity-50">
                            <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 border-t-gray-900 dark:border-t-white rounded-full animate-spin mb-3"></div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-widest">Syncing</p>
                        </div>
                    ) : (
                        <FileList
                            files={filteredFiles}
                            onPreview={onPreview}
                            onDownload={onDownload}
                            onDelete={handleFileDelete}
                        />
                    )}
                </div>

            </div>
        </div>
    );
};

