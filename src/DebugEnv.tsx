import React from 'react';

const DebugEnv: React.FC = () => {
  const password = import.meta.env.VITE_APP_PASSWORD || 'NOT SET';
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'NOT SET';
  const storageProvider = import.meta.env.VITE_STORAGE_PROVIDER || 'NOT SET';
  
  return (
    <div className="fixed bottom-0 left-0 bg-yellow-100 dark:bg-yellow-900 p-4 text-xs z-50">
      <h3 className="font-bold mb-2">Environment Variables Debug</h3>
      <p>Password: {password}</p>
      <p>Storage Provider: {storageProvider}</p>
      <p>Supabase URL: {supabaseUrl.substring(0, 30)}...</p>
    </div>
  );
};

export default DebugEnv;