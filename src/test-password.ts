// Simple test to check what password is being loaded
export const testPassword = () => {
  const password = import.meta.env.VITE_APP_PASSWORD || 'NOT SET';
  console.log('Loaded password:', password);
  return password;
};