export interface Assignment {
    id: string;
    srNo: string;
    semester: string;
    subject: string;
    instructor: string;
    title: string;
    instructions: string;
    totalMarks: string;
    comments: string;
    submissionValidity: string;
    isCompleted: boolean;
    snippet?: string;
    rawText: string;
    dateAdded: number;
}