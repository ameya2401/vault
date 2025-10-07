import { supabase } from '../supabaseClient';
import { CodeSnippet } from '../types';

export const codeService = {
  // Save a code snippet
  async saveCodeSnippet(snippet: CodeSnippet) {
    const { data, error } = await supabase
      .from('code_snippets')
      .insert([
        {
          title: snippet.title,
          code_content: snippet.code_content,
          language: snippet.language,
          category: snippet.category,
        }
      ])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return data[0];
  },

  // Get all code snippets
  async getCodeSnippets() {
    const { data, error } = await supabase
      .from('code_snippets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Update a code snippet
  async updateCodeSnippet(snippetId: string, snippet: Partial<CodeSnippet>) {
    const { data, error } = await supabase
      .from('code_snippets')
      .update({
        title: snippet.title,
        code_content: snippet.code_content,
        language: snippet.language,
        category: snippet.category,
        updated_at: new Date().toISOString(),
      })
      .eq('id', snippetId)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return data[0];
  },

  // Delete a code snippet
  async deleteCodeSnippet(snippetId: string) {
    const { error } = await supabase
      .from('code_snippets')
      .delete()
      .eq('id', snippetId);

    if (error) {
      throw new Error(error.message);
    }
  }
};