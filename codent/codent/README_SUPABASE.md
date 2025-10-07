# Supabase Integration Setup

This document explains how to set up Supabase for the Smart Code Notepad application to store saved files in the cloud.

## Prerequisites

1. Create a Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new Supabase project

## Setup Instructions

### 1. Database Setup

1. In your Supabase project dashboard, go to the SQL Editor
2. Copy and paste the contents of `SUPABASE_SCHEMA.sql` into the editor
3. Run the SQL script to create the necessary tables and policies

### 2. Environment Variables

Update your `.env` file with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project dashboard:
- Go to Project Settings → API
- Copy the Project URL and anon key

## Features Implemented

### Code Snippet Storage
- Save code snippets to Supabase database
- Retrieve code snippets from Supabase
- Update existing code snippets
- Delete code snippets
- Fallback to localStorage if Supabase is not configured

## Security

For this implementation, since we're not using authentication, the Row Level Security (RLS) is configured to allow all operations. In a production environment with authentication, you would want to restrict access to only authenticated users.

## API Services

### CodeService
Located in `src/services/codeService.ts`:
- `saveCodeSnippet(snippet)` - Save a new code snippet
- `updateCodeSnippet(snippetId, snippet)` - Update an existing code snippet
- `getCodeSnippets()` - Retrieve all code snippets
- `deleteCodeSnippet(snippetId)` - Delete a code snippet

## How It Works

1. **Saving Files**: When you save a code snippet, it's stored in the Supabase database
2. **Loading Files**: When the application starts, it loads all saved snippets from Supabase
3. **Deleting Files**: When you delete a snippet, it's removed from Supabase
4. **Fallback**: If Supabase is not configured or there's an error, the application falls back to localStorage

## Migration from LocalStorage

The application now uses Supabase for code snippet storage while maintaining the same user interface and functionality. All existing functionality is preserved while adding cloud synchronization.

To migrate existing data from localStorage to Supabase:
1. Configure Supabase in your environment variables
2. The application will automatically load from Supabase on startup
3. Existing localStorage data will only be used if Supabase fails