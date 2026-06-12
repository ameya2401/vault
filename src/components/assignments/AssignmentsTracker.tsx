import React, { useState, useEffect } from 'react';
import { Assignment } from '../../types/assignment';
import { parseAssignments } from '../../lib/assignmentParser';
import { FileText, CheckCircle, Clock, Search, Code, Check, ArrowDownUp } from 'lucide-react'; import { DEFAULT_ASSIGNMENTS_TEXT } from '../../data/defaultAssignments';
export default function AssignmentsTracker() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [pasteText, setPasteText] = useState('');
    const [activeAssignment, setActiveAssignment] = useState<Assignment | null>(null);
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'deadline' | 'title' | 'marks'>('deadline');
    const [sortAsc, setSortAsc] = useState(true);

    // Load from local storage
    useEffect(() => {
        const saved = localStorage.getItem('fileupload_assignments');
        if (saved) {
            try {
                const parsedSaved = JSON.parse(saved);
                if (parsedSaved && parsedSaved.length > 0) {
                    setAssignments(parsedSaved);
                    return;
                }
            } catch (e) {
                console.error('Error parsing assignments from storage', e);
            }
        }

        // If no saved assignments, auto-load defaults
        const defaultData = parseAssignments(DEFAULT_ASSIGNMENTS_TEXT);
        setAssignments(defaultData);
        localStorage.setItem('fileupload_assignments', JSON.stringify(defaultData));
    }, []);

    // Save to local storage
    const saveAssignments = (newAssignments: Assignment[]) => {
        setAssignments(newAssignments);
        localStorage.setItem('fileupload_assignments', JSON.stringify(newAssignments));
    };

    const handleParse = () => {
        if (!pasteText.trim()) return;
        const parsed = parseAssignments(pasteText);

        // Merge with existing, avoiding duplicates based on Title + Subject
        const existingMap = new Map(assignments.map(a => [`${a.title}-${a.subject}`, a]));
        parsed.forEach(a => {
            if (!existingMap.has(`${a.title}-${a.subject}`)) {
                existingMap.set(`${a.title}-${a.subject}`, a);
            }
        });

        saveAssignments(Array.from(existingMap.values()));
        setPasteText('');
    };

    const clearAll = () => {
        if (window.confirm('Are you sure you want to clear all assignments?')) {
            saveAssignments([]);
        }
    };

    const toggleCompleted = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const updated = assignments.map(a =>
            a.id === id ? { ...a, isCompleted: !a.isCompleted } : a
        );
        saveAssignments(updated);
    };

    const updateSnippet = (id: string, snippet: string) => {
        const updated = assignments.map(a =>
            a.id === id ? { ...a, snippet } : a
        );
        saveAssignments(updated);
    };

    // Helper to extract a sortable timestamp from the validity string
    const parseDeadline = (validityStr: string) => {
        if (!validityStr) return Number.MAX_SAFE_VALUE;
        try {
            // Find the end date "25th May,2026 - 27th May,2026 Time:..."
            const parts = validityStr.split('-');
            if (parts.length < 2) return Number.MAX_SAFE_VALUE;

            // " 27th May,2026 Time: 07:00 am "
            const endPart = parts[1].split('Time:')[0].trim();
            // Remove 'th', 'st', 'nd', 'rd' from date numbers
            const cleanDate = endPart.replace(/(\d+)(st|nd|rd|th)/, '$1');

            let timeStr = '23:59:59';
            const timeMatch = validityStr.match(/Time:\s*.*?-\s*(\d{2}:\d{2}\s*[ap]m)/i);
            if (timeMatch && timeMatch[1]) {
                timeStr = timeMatch[1];
            }

            const timestamp = Date.parse(`${cleanDate} ${timeStr}`);
            return isNaN(timestamp) ? Number.MAX_SAFE_VALUE : timestamp;
        } catch (e) {
            return Number.MAX_SAFE_VALUE;
        }
    };

    // Filter and Sort
    const filteredAssignments = assignments
        .filter(a => {
            if (filter === 'pending') return !a.isCompleted;
            if (filter === 'completed') return a.isCompleted;
            return true;
        })
        .filter(a =>
            (a.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (a.subject || '').toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            // Basic sorting: pending first
            if (a.isCompleted !== b.isCompleted) {
                return a.isCompleted ? 1 : -1;
            }

            let comparison = 0;
            switch (sortBy) {
                case 'deadline':
                    const dateA = parseDeadline(a.submissionValidity);
                    const dateB = parseDeadline(b.submissionValidity);
                    comparison = dateA - dateB;
                    break;
                case 'marks':
                    const marksA = parseFloat(a.totalMarks) || 0;
                    const marksB = parseFloat(b.totalMarks) || 0;
                    comparison = marksB - marksA; // Default highest first
                    break;
                case 'title':
                    comparison = (a.title || '').localeCompare(b.title || '');
                    break;
            }

            return sortAsc ? comparison : -comparison;
        });

    return (
        <div className="flex flex-col h-full bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800 p-4 overflow-hidden">
            {/* Header and Input Area */}
            <div className="mb-6 space-y-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-5 h-5" /> Tracker
                </h2>

                <div className="flex gap-2">
                    <textarea
                        value={pasteText}
                        onChange={e => setPasteText(e.target.value)}
                        placeholder="Paste assignment table from e-MediLife here..."
                        className="flex-1 min-h-[60px] max-h-[120px] p-3 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md focus:ring-1 focus:ring-black dark:focus:ring-white resize-y"
                    />
                    <button
                        onClick={handleParse}
                        className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors whitespace-nowrap"
                    >
                        Import
                    </button>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                <div className="flex bg-gray-100 dark:bg-gray-900 rounded-md p-1">
                    {(['all', 'pending', 'completed'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-md capitalize transition-colors ${filter === f
                                ? 'bg-white dark:bg-black text-black dark:text-white shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="whitespace-nowrap">Sort by:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md py-1.5 px-2 focus:ring-1 focus:ring-black outline-none"
                    >
                        <option value="deadline">Expiry Date</option>
                        <option value="title">Title</option>
                        <option value="marks">Marks</option>
                    </select>
                    <button
                        onClick={() => setSortAsc(!sortAsc)}
                        className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md text-gray-500 transition-colors"
                        title={sortAsc ? "Sort Ascending" : "Sort Descending"}
                    >
                        <ArrowDownUp className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Search assignments..."
                            className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md"
                        />
                    </div>
                    {assignments.length > 0 && (
                        <button
                            onClick={clearAll}
                            className="px-3 py-2 text-xs text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md hover:bg-red-100 dark:hover:bg-red-900/40"
                        >
                            Clear All
                        </button>
                    )}
                </div>
            </div>

            {/* List Area */}
            <div className="flex-1 overflow-auto border border-gray-200 dark:border-gray-800 rounded-md bg-gray-50 dark:bg-[#0a0a0a]">
                {filteredAssignments.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-6 text-center">
                        <FileText className="w-12 h-12 mb-2 opacity-20" />
                        <p>No assignments found.</p>
                        <p className="text-xs mt-1">Paste your table from the portal and click Import.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-800">
                        {filteredAssignments.map(assignment => (
                            <div
                                key={assignment.id}
                                onClick={() => setActiveAssignment(assignment)}
                                className={`p-4 hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer transition-colors ${assignment.isCompleted ? 'opacity-60' : ''
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className={`font-semibold truncate ${assignment.isCompleted ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
                                                {assignment.title}
                                            </h3>
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                                {assignment.subject}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                            {assignment.submissionValidity && (
                                                <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400 font-medium">
                                                    <Clock className="w-3 h-3" />
                                                    {assignment.submissionValidity}
                                                </div>
                                            )}
                                            <span>Instructor: {assignment.instructor}</span>
                                            <span>Marks: {assignment.totalMarks}</span>
                                            {assignment.snippet && (
                                                <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                                                    <Code className="w-3 h-3" /> Has Code/Notes
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={(e) => toggleCompleted(assignment.id, e)}
                                        className={`shrink-0 p-2 rounded-full transition-colors ${assignment.isCompleted
                                            ? 'text-green-600 bg-green-50 dark:bg-green-900/20'
                                            : 'text-gray-400 hover:text-black dark:hover:text-white bg-white dark:bg-black border border-gray-200 dark:border-gray-700'
                                            }`}
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {activeAssignment && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-start">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{activeAssignment.title}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{activeAssignment.subject}</p>
                            </div>
                            <button
                                onClick={() => setActiveAssignment(null)}
                                className="text-gray-500 hover:text-black dark:hover:text-white px-2 py-1 rounded"
                            >
                                Close
                            </button>
                        </div>

                        <div className="p-4 overflow-auto flex-1 flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                                <div className="space-y-1">
                                    <p><span className="opacity-50">Instructor:</span> {activeAssignment.instructor}</p>
                                    <p><span className="opacity-50">Deadline:</span> {activeAssignment.submissionValidity}</p>
                                    <p><span className="opacity-50">Marks:</span> {activeAssignment.totalMarks}</p>
                                </div>
                                <div className="space-y-1">
                                    <p><span className="opacity-50">Instructions:</span> {activeAssignment.instructions}</p>
                                    <p><span className="opacity-50">Status:</span> {activeAssignment.isCompleted ? 'Completed' : 'Pending'}</p>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col gap-2 min-h-[300px]">
                                <label className="text-sm font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                    <Code className="w-4 h-4" /> Attachment / Code Snippet / Notes
                                </label>
                                <textarea
                                    value={activeAssignment.snippet || ''}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setActiveAssignment({ ...activeAssignment, snippet: val });
                                        updateSnippet(activeAssignment.id, val);
                                    }}
                                    placeholder="Paste any related code, notes, or solutions here for this assignment..."
                                    className="flex-1 w-full p-4 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-md font-mono text-sm focus:ring-1 focus:ring-black dark:focus:ring-white resize-none text-gray-900 dark:text-gray-100 placeholder:opacity-50"
                                    spellCheck="false"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}