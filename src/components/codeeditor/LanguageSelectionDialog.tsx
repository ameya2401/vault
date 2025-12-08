import { X } from 'lucide-react';

interface LanguageSelectionDialogProps {
    onSelect: (language: string) => void;
    onClose: () => void;
}

export default function LanguageSelectionDialog({ onSelect, onClose }: LanguageSelectionDialogProps) {
    const languages = [
        { id: 'java', name: 'Java', description: 'Java programming language' },
        { id: 'sql', name: 'SQL', description: 'Structured Query Language' }
    ];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md mx-4 border border-gray-200 dark:border-gray-800">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-lg font-semibold text-black dark:text-white">
                        Select Language
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                    >
                        <X size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                {/* Language Options */}
                <div className="p-4 space-y-2">
                    {languages.map((lang) => (
                        <button
                            key={lang.id}
                            onClick={() => onSelect(lang.id)}
                            className="w-full text-left p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group"
                        >
                            <div className="font-medium text-black dark:text-white group-hover:text-black dark:group-hover:text-white">
                                {lang.name}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {lang.description}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
