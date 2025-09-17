# Vault - File Storage Application

A modern, secure file upload and management application.

## Features

- Secure password-protected access
- Drag & drop file uploads
- File preview for images, videos, audio, PDFs, and text files
- File download and management
- Dark/Light theme support
- Responsive design for all devices

## Tech Stack

- React + TypeScript
- Vite for fast development
- Supabase for backend storage
- Tailwind CSS for styling

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure your Supabase project (see SUPABASE_SETUP.md)
4. Set up environment variables in `.env`
5. Run development server: `npm run dev`

## Environment Setup

Create a `.env` file with:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_PASSWORD=your_app_password
```

## License

MIT License - feel free to use for personal or commercial projects.