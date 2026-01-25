import React, { useState, useEffect } from 'react';
import { FileUpload } from '../components/FileUpload';
import { FileList } from '../components/FileList';
import { UploadedFile } from '../types/file';
import { storageService } from '../lib/storage';
import { AlertTriangle } from 'lucide-react';

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
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [folderName, setFolderName] = useState('');

    const EXAM_FOLDER = 'exam-files';

    useEffect(() => {
        loadFiles();
    }, []);

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
            // Construct upload path based on user input folder
            // Sanitize folder name: remove leading/trailing slashes and spaces
            const cleanSubFolder = folderName.trim().replace(/^\/+|\/+$/g, '');
            const targetFolder = cleanSubFolder
                ? `${EXAM_FOLDER}/${cleanSubFolder}`
                : EXAM_FOLDER;

            // Upload to exam folder
            const uploadedFile = await storageService.uploadFile(file, targetFolder);

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

    // Helper to group files by folder
    const getGroupedFiles = () => {
        const groups: { [key: string]: UploadedFile[] } = {};

        files.forEach(file => {
            // Parse folder from path
            // Format: exam-files/subfolder/filename or exam-files/filename
            const relativePath = file.file_path.replace(`${EXAM_FOLDER}/`, '');
            const parts = relativePath.split('/');

            // If parts > 1, it has a subfolder. The last part is the filename.
            // If parts === 1, it's in the root of exam-files
            let groupName = 'General';
            if (parts.length > 1) {
                // Join all parts except the last one to get the folder path
                groupName = parts.slice(0, -1).join('/');
            }

            if (!groups[groupName]) {
                groups[groupName] = [];
            }
            groups[groupName].push(file);
        });

        // Sort keys to maximize consistency (General first, then alphabetical)
        return Object.keys(groups).sort().reduce((acc: any, key) => {
            acc[key] = groups[key];
            return acc;
        }, {});
    };

    const groupedFiles = getGroupedFiles();


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

            <div className="max-w-xs mx-auto">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Folder Name (Optional)
                </label>
                <input
                    type="text"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    placeholder="e.g. dsa, web, java"
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
                />
                <p className="text-[10px] text-gray-500 mt-1">
                    Use folders to organize your files. URL lookup remains flat (by filename).
                </p>
            </div>

            <FileUpload onFileUpload={handleFileUpload} uploading={uploading} />

            {loading ? (
                <div className="text-center py-6">
                    <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 border-t-red-500 rounded-full animate-spin mx-auto"></div>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 text-xs">Loading exam files...</p>
                </div>
            ) : (
                <div className="w-full max-w-2xl mx-auto space-y-8">
                    {files.length > 0 && (
                        <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-4 mb-4 text-center">
                            <p className="text-sm font-medium text-red-500">
                                <b>use / and then write the name of the file uploaded in url it will open</b>
                            </p>
                        </div>
                    )}

                    {Object.keys(groupedFiles).length === 0 && files.length > 0 && (
                        <FileList
                            files={files}
                            onPreview={onPreview}
                            onDownload={onDownload}
                            onDelete={handleFileDelete}
                        />
                    )}

                    {Object.entries(groupedFiles).map(([group, groupFiles]) => (
                        <div key={group} className="space-y-3">
                            <div className="flex items-center space-x-2 border-b border-gray-200 dark:border-gray-800 pb-2">
                                <span className={`text-xs font-bold px-2 py-1 rounded ${group === 'General' ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                                    {group}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {(groupFiles as UploadedFile[]).length} files
                                </span>
                            </div>
                            <FileList
                                files={(groupFiles as UploadedFile[])}
                                onPreview={onPreview}
                                onDownload={onDownload}
                                onDelete={handleFileDelete}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
