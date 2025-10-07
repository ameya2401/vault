export interface CodeSnippet {
  id: string;
  code_content: string;
  title: string;
  category: string;
  language: string;
  created_at: string;
  updated_at: string;
}

export type TabType = 'editor' | 'indenter' | 'saved';

export type CategoryType = 'All' | 'DSA' | 'WebTech' | 'DBMS' | 'Uncategorized';

// New type for open files
export interface OpenFile {
  id: string;
  title: string;
  code_content: string;
  language: string;
}