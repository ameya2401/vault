import { useState } from 'react';
import { Lock } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Get password from environment variable or use default
  const getCurrentPassword = () => {
    return import.meta.env.VITE_APP_PASSWORD || 'smartcode123';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentPassword = getCurrentPassword();

    if (password === currentPassword) {
      onLogin();
      setError('');
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Lock className="w-12 h-12 text-white" />
        </div>

        <h1 className="text-3xl font-bold text-white text-center mb-2 font-['Poppins']">
          Smart Code Notepad
        </h1>

        <p className="text-gray-400 text-center mb-8 font-['Poppins']">
          Enter password to access
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 bg-white text-black border-2 border-gray-800 focus:border-white focus:outline-none transition-colors font-['Poppins']"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm font-['Poppins']">{error}</p>
          )}

          <button
            type="submit"
            className="w-full px-4 py-3 bg-white text-black font-semibold hover:bg-gray-200 transition-colors font-['Poppins']"
          >
            Access
          </button>
        </form>

        <p className="text-gray-600 text-xs text-center mt-6 font-['Poppins']">
          MVP Version - Password set in environment variables
        </p>
      </div>
    </div>
  );
}
