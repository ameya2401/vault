import { Assignment } from '../types/assignment';

export function parseAssignments(text: string): Assignment[] {
    const lines = text.trim().split('\n');
    if (lines.length === 0) return [];

    // Find start of data (usually after header)
    let startIndex = 0;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('Sr.No.') || lines[i].includes('Semester/Year')) {
            startIndex = i + 1;
            break;
        }
    }

    const assignments: Assignment[] = [];

    // The provided text is TSV-like format from a web table
    for (let i = startIndex; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line) continue;

        // Look ahead to capture multi-line dates/times which are split in pasting
        if (i + 1 < lines.length && lines[i + 1].trim().startsWith('Time:')) {
            line += ' ' + lines[i + 1].trim();
            i++;
        }

        const parts = line.split('\t');
        if (parts.length < 5) continue; // Basic validation

        // Fallback parsing if split isn't perfect, but typically table copy-paste is tab-separated.

        try {
            const isCompleted = line.includes('Completed') || line.includes('Upload Checked copy') && line.includes('Completed'); // Basic heuristics

            // Usually Submission Validity is the last element if it exists
            const validityIndex = parts.findIndex(p => p.match(/\d+(st|nd|rd|th) [A-Z][a-z]+,\d{4}/));
            const submissionValidity = validityIndex !== -1 ? parts[validityIndex] : (parts.length > 11 ? parts[11] : parts[parts.length - 1] || '');

            assignments.push({
                id: crypto.randomUUID(),
                srNo: parts[0] || '',
                semester: parts[1] || '',
                subject: parts[2] || '',
                instructor: parts[3] || '',
                title: parts[4] || '',
                instructions: parts[5] || '',
                totalMarks: parts[6] || '',
                comments: parts[8] || '',
                submissionValidity: submissionValidity,
                isCompleted: isCompleted,
                snippet: '',
                rawText: line,
                dateAdded: Date.now()
            });
        } catch (e) {
            console.error("Error parsing row: ", line);
        }
    }

    return assignments;
}