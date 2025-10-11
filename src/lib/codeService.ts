import { supabase } from './supabase';
import { CodeSnippet } from '../types/code';

export const codeService = {
  // Save a code snippet
  async saveCodeSnippet(snippet: CodeSnippet) {
    try {
      const { data, error } = await supabase
        .from('code_snippets')
        .insert(snippet)
        .select()
        .single();

      if (error) {
        console.error('Error saving code snippet:', error);
        throw new Error(`Failed to save code snippet: ${error.message}`);
      }

      console.log('Code snippet saved successfully:', data);
      return data;
    } catch (error) {
      console.error('Error saving code snippet:', error);
      throw error;
    }
  },

  // Get all code snippets
  async getCodeSnippets() {
    try {
      const { data, error } = await supabase
        .from('code_snippets')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching code snippets:', error);
        throw new Error(`Failed to fetch code snippets: ${error.message}`);
      }

      console.log(`Loaded ${data.length} code snippets`);
      return data || [];
    } catch (error) {
      console.error('Error fetching code snippets:', error);
      throw error;
    }
  },

  // Update a code snippet
  async updateCodeSnippet(snippetId: string, snippet: Partial<CodeSnippet>) {
    try {
      const { data, error } = await supabase
        .from('code_snippets')
        .update({ ...snippet, updated_at: new Date().toISOString() })
        .eq('id', snippetId)
        .select()
        .single();

      if (error) {
        console.error('Error updating code snippet:', error);
        throw new Error(`Failed to update code snippet: ${error.message}`);
      }

      if (!data) {
        console.warn('No code snippet found with id:', snippetId);
        return null;
      }

      console.log('Code snippet updated successfully:', data);
      return data;
    } catch (error) {
      console.error('Error updating code snippet:', error);
      throw error;
    }
  },

  // Delete a code snippet
  async deleteCodeSnippet(snippetId: string) {
    try {
      const { error } = await supabase
        .from('code_snippets')
        .delete()
        .eq('id', snippetId);

      if (error) {
        console.error('Error deleting code snippet:', error);
        throw new Error(`Failed to delete code snippet: ${error.message}`);
      }

      console.log('Code snippet deleted successfully:', snippetId);
    } catch (error) {
      console.error('Error deleting code snippet:', error);
      throw error;
    }
  },

  // Helper method (kept for backward compatibility but not used with Supabase)
  getCodeSnippetsFromStorage(): CodeSnippet[] {
    // This is no longer used with Supabase implementation
    return [];
  }
};