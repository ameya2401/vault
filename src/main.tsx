import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { QuickCodeViewer } from './temporary-exam-feature/QuickCodeViewer';
import './index.css';

// Simple routing based on pathname
const path = window.location.pathname;
const isRoot = path === '/' || path === '';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isRoot ? <App /> : <QuickCodeViewer />}
  </StrictMode>
);
