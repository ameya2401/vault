// Supabase Setup Validation Script
// Run this in the browser console after logging in to check your setup

import { supabase } from './src/lib/supabase.js';

async function validateSupabaseSetup() {
  console.log('🔍 Validating Supabase Setup...\n');
  
  let allGood = true;
  
  // 1. Check connection
  console.log('1. Testing database connection...');
  try {
    const { data, error } = await supabase.from('files').select('count').limit(1);
    if (error) {
      console.error('❌ Database connection failed:', error.message);
      if (error.message.includes('relation "files" does not exist')) {
        console.log('💡 Solution: You need to create the files table. Run this SQL in Supabase SQL Editor:');
        console.log(`
CREATE TABLE IF NOT EXISTS files (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  size BIGINT NOT NULL,
  type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE files DISABLE ROW LEVEL SECURITY;
        `);
      }
      allGood = false;
    } else {
      console.log('✅ Database connection successful');
    }
  } catch (err) {
    console.error('❌ Database connection error:', err);
    allGood = false;
  }
  
  // 2. Check storage bucket
  console.log('\n2. Checking storage bucket...');
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) {
      console.error('❌ Storage access failed:', error.message);
      allGood = false;
    } else {
      const filesBucket = buckets.find(bucket => bucket.name === 'files');
      if (!filesBucket) {
        console.error('❌ "files" bucket not found');
        console.log('💡 Solution: Create a storage bucket named "files" in Supabase Dashboard > Storage');
        allGood = false;
      } else {
        console.log('✅ "files" bucket exists');
        console.log('Bucket info:', {
          name: filesBucket.name,
          public: filesBucket.public,
          created: filesBucket.created_at
        });
      }
    }
  } catch (err) {
    console.error('❌ Storage bucket check error:', err);
    allGood = false;
  }
  
  // 3. Test file upload
  console.log('\n3. Testing file upload...');
  try {
    const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const { data, error } = await supabase.storage
      .from('files')
      .upload(`test/${Date.now()}-test.txt`, testFile);
    
    if (error) {
      console.error('❌ File upload test failed:', error.message);
      if (error.message.includes('The resource was not found')) {
        console.log('💡 Solution: Make sure the "files" bucket exists and is properly configured');
      } else if (error.message.includes('new row violates row-level security')) {
        console.log('💡 Solution: Disable RLS or create proper policies for the storage bucket');
      }
      allGood = false;
    } else {
      console.log('✅ File upload test successful');
      // Clean up test file
      await supabase.storage.from('files').remove([data.path]);
      console.log('✅ Test file cleaned up');
    }
  } catch (err) {
    console.error('❌ File upload test error:', err);
    allGood = false;
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  if (allGood) {
    console.log('🎉 All checks passed! Your Supabase setup is ready.');
  } else {
    console.log('⚠️  Some issues found. Please fix the issues above and try again.');
    console.log('\n📖 For detailed setup instructions, see SUPABASE_SETUP.md');
  }
  console.log('='.repeat(50));
}

// Run validation
validateSupabaseSetup();