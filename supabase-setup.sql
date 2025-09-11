-- Complete Supabase setup for Vault file upload app
-- Run this in Supabase SQL Editor

-- 1. Create the files table
CREATE TABLE IF NOT EXISTS files (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  size BIGINT NOT NULL,
  type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Disable RLS for personal use (easier)
ALTER TABLE files DISABLE ROW LEVEL SECURITY;

-- 3. Create storage bucket policy (if bucket exists)
-- Option A: Run this if you want to use policies
-- INSERT INTO storage.buckets (id, name, public) VALUES ('user-files', 'user-files', true) ON CONFLICT DO NOTHING;

-- Option B: Create storage policy (alternative to making bucket public)
-- CREATE POLICY "Allow all storage operations" ON storage.objects 
-- FOR ALL USING (bucket_id = 'user-files');

-- 4. Alternative: If you prefer RLS policies instead of disabling RLS
-- ALTER TABLE files ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all operations" ON files FOR ALL USING (true);