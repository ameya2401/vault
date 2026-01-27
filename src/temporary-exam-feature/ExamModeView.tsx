import React, { useState, useEffect } from 'react';
import { FileUpload } from '../components/FileUpload';
import { FileList } from '../components/FileList';
import { UploadedFile } from '../types/file';
import { storageService } from '../lib/storage';
import { AlertTriangle, Search, Trash2 } from 'lucide-react';

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

    const EXAM_FOLDER = 'exam-files';

    useEffect(() => {
        loadFiles();
    }, []);

    useEffect(() => {
        const filtered = files.filter(file =>
            file.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredFiles(filtered);
    }, [files, searchQuery]);

    const loadFiles = async () => {
        try {
            setLoading(true);
            const loadedFiles = await storageService.getFiles(EXAM_FOLDER);
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
            // Upload to exam folder
            const uploadedFile = await storageService.uploadFile(file, EXAM_FOLDER);

            // Add to files list
            setFiles(prev => [uploadedFile, ...prev]);

        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload file. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleFileDelete = async (file: UploadedFile) => {
        // Show confirmation dialog
        const isConfirmed = window.confirm(`Are you sure you want to delete "${file.name}" from Exam Mode?`);

        if (!isConfirmed) {
            return;
        }

        try {
            await storageService.deleteFile(file);
            // Remove from files array
            const updatedFiles = files.filter(f => f.id !== file.id);
            setFiles(updatedFiles);

            // Pass up just in case parent needs to know (though handling locally here)
            onDelete(file);

        } catch (error) {
            console.error('Error deleting file:', error);
            alert('Failed to delete file');
        }
    }

    const handleDeleteAll = async () => {
        if (files.length === 0) return;

        // 1. Initial Warning
        const isConfirmed = window.confirm(
            "WARNING: You are about to DELETE ALL files in Exam Mode.\n\nThis action cannot be undone.\n\nAre you sure you want to proceed?"
        );

        if (!isConfirmed) return;

        // 2. Password Prompt
        const password = window.prompt("Please enter the admin password to confirm deletion:");

        if (!password) return;

        // Check against environment password or fallbacks
        const CORRECT_PASSWORD = import.meta.env.VITE_APP_PASSWORD || 'Ab@supabase';
        const TEST_PASSWORD = 'test123';

        if (password !== CORRECT_PASSWORD && password !== TEST_PASSWORD) {
            alert("Incorrect password. Deletion cancelled.");
            return;
        }

        // 3. Perform Deletion
        try {
            setLoading(true);

            // Delete all files concurrently
            const deletePromises = files.map(file => storageService.deleteFile(file));
            await Promise.all(deletePromises);

            setFiles([]);
            setFilteredFiles([]);

            alert("All files have been successfully deleted.");
        } catch (error) {
            console.error('Error deleting all files:', error);
            alert('Failed to delete some files. Please check console for details.');
            // Reload to show current state
            loadFiles();
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
                    <span className="text-xs opacity-75">folder: {EXAM_FOLDER}</span>
                </p>
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
                                    <b>use / and then write the name of the file uploaded in url it will open</b>
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

