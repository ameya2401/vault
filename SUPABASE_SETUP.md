# Supabase Setup Guide for Vault

## 🚀 **Complete Setup Guide for Supabase:**

### 1. **Create Supabase Project**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New project"
3. Choose your organization
4. Enter project name (e.g., "vault-storage")
5. Enter a strong database password
6. Select your region (choose closest to you)
7. Click "Create new project"

### 2. **Get Project Configuration**
1. In your project dashboard, go to Settings > API
2. Copy your project URL and anon public key:
   - Project URL: `https://your-project-ref.supabase.co`
   - Anon key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. **Update Environment Variables**
Update your `.env` file with your Supabase configuration:

```env
# Storage Provider (supabase only)
VITE_STORAGE_PROVIDER=supabase

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here

# Simple Password Protection (Change this!)
VITE_APP_PASSWORD=your_secure_password
```

### 4. **Set Up Database**
1. Go to SQL Editor in your Supabase dashboard
2. Run the following SQL to create the files table:

```sql
-- Create the files table
CREATE TABLE IF NOT EXISTS files (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  size BIGINT NOT NULL,
  type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS for personal use (easier setup)
ALTER TABLE files DISABLE ROW LEVEL SECURITY;
```

### 5. **Set Up Storage Bucket**
1. Go to Storage in your Supabase dashboard
2. Click "Create bucket"
3. Name it `files`
4. Set it to public (for easier file access)
5. Click "Create bucket"

### 6. **Configure Storage Policies (Optional)**
If you want more control over file access, you can set up storage policies:

```sql
-- Create policy for file uploads
CREATE POLICY "Allow file uploads" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'files');

-- Create policy for file downloads
CREATE POLICY "Allow file downloads" ON storage.objects 
FOR SELECT USING (bucket_id = 'files');

-- Create policy for file deletions
CREATE POLICY "Allow file deletions" ON storage.objects 
FOR DELETE USING (bucket_id = 'files');
```

### 7. **Verify Setup**
1. Start your development server: `npm run dev`
2. Open the app and try uploading a file
3. Check the browser console for any connection errors
4. Verify files appear in your Supabase Storage dashboard

## 📋 **Features Enabled:**
- ✅ File upload to Supabase Storage
- ✅ File metadata stored in Supabase Database
- ✅ File download and preview
- ✅ File deletion
- ✅ Real-time file listing
- ✅ Text file content preview
- ✅ Password protection

## 🔧 **Troubleshooting:**

### Connection Issues:
- Verify your Supabase URL and key are correct
- Check that your bucket name matches (`files`)
- Ensure RLS is disabled or proper policies are set

### Upload Issues:
- Check file size limits in Supabase dashboard
- Verify storage bucket is public or has proper policies
- Check browser console for detailed error messages

### Database Issues:
- Ensure the `files` table exists with correct schema
- Verify database connection in Supabase dashboard
- Check that RLS is properly configured

## 💡 **Production Considerations:**
1. **Enable RLS** and create proper row-level security policies
2. **Set up proper authentication** instead of simple password
3. **Configure file size limits** in storage settings
4. **Set up backup policies** for your data
5. **Monitor usage** to stay within free tier limits

## 📊 **Supabase Free Tier Limits:**
- Database: 500MB
- Storage: 1GB
- Bandwidth: 2GB
- API requests: 50,000/month

## 🚀 **Ready to Use:**
Your vault is now configured with Supabase! You can upload, download, preview, and manage your files securely.