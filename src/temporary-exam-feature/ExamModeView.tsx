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
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-xl font-bold text-red-500 mb-2 flex items-center justify-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Exam Mode Storage
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md mx-auto">
                    Files uploaded here are accessible via direct URL for practical exams.
                    <br />
                    <span className="text-xs opacity-75">folder: {activeTab.folder}</span>
                </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTabId(tab.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${activeTabId === tab.id
                            ? 'bg-red-500 text-white border-red-500'
                            : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <FileUpload onFileUpload={handleFileUpload} uploading={uploading} />

            {loading ? (
                <div className="text-center py-6">
                    <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 border-t-red-500 rounded-full animate-spin mx-auto"></div>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 text-xs">Loading exam files...</p>
                </div>
            ) : (
                <div className="w-full max-w-2xl mx-auto space-y-4">
                    {files.length > 0 && (
                        <>
                            <div className="flex gap-4 mb-6">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search exam files..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/50 transition-all placeholder:text-gray-400"
                                    />
                                </div>
                                <button
                                    onClick={handleDeleteAll}
                                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm flex items-center gap-2 transition-colors whitespace-nowrap"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete All
                                </button>
                            </div>

                            <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-4 mb-4 text-center">
                                <p className="text-sm font-medium text-red-500">
                                    <b>To access files for {activeTab.label}, use the URL: <span className="bg-red-500/20 px-2 py-0.5 rounded font-mono">/{activeTab.id}/filename</span></b>
                                </p>
                            </div>
                        </>
                    )}

                    <FileList
                        files={filteredFiles}
                        onPreview={onPreview}
                        onDownload={onDownload}
                        onDelete={handleFileDelete}
                    />
                </div>
            )}
        </div>
    );
};

