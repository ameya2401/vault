import { CodeSnippet } from '../types/code';

// For now, we'll use localStorage as a placeholder
// In a real implementation, this would connect to Supabase
export const codeService = {
  // Save a code snippet
  async saveCodeSnippet(snippet: CodeSnippet) {
    // This is a placeholder implementation
    // In a real app, this would save to Supabase
    const snippets = this.getCodeSnippetsFromStorage();
    snippets.push(snippet);
    localStorage.setItem('codeSnippets', JSON.stringify(snippets));
    return snippet;
  },

  // Get all code snippets
  async getCodeSnippets() {
    // This is a placeholder implementation
    // In a real app, this would fetch from Supabase
    return this.getCodeSnippetsFromStorage();
  },

  // Update a code snippet
  async updateCodeSnippet(snippetId: string, snippet: Partial<CodeSnippet>) {
    // This is a placeholder implementation
    // In a real app, this would update in Supabase
    const snippets = this.getCodeSnippetsFromStorage();
    const index = snippets.findIndex(s => s.id === snippetId);
    if (index !== -1) {
      snippets[index] = { ...snippets[index], ...snippet, updated_at: new Date().toISOString() };
      localStorage.setItem('codeSnippets', JSON.stringify(snippets));
      return snippets[index];
    }
    return null;
  },

  // Delete a code snippet
  async deleteCodeSnippet(snippetId: string) {
    // This is a placeholder implementation
    // In a real app, this would delete from Supabase
    const snippets = this.getCodeSnippetsFromStorage();
    const filteredSnippets = snippets.filter(s => s.id !== snippetId);
    localStorage.setItem('codeSnippets', JSON.stringify(filteredSnippets));
  },

  // Helper method to get snippets from localStorage
  getCodeSnippetsFromStorage(): CodeSnippet[] {
    const snippets = localStorage.getItem('codeSnippets');
    return snippets ? JSON.parse(snippets) : [];
  }
};