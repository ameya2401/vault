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

## 🌟 Features

- 🔐 **Password Protection** - Simple password-based access control
- 📁 **File Upload** - Drag & drop or click to upload files
- 👁️ **File Preview** - Preview text files, images, and documents
- 📥 **File Download** - Download files with original names
- 🗑️ **File Management** - Delete files with confirmation
- 🌙 **Dark/Light Theme** - Toggle between themes
- 📱 **Responsive Design** - Works on desktop and mobile

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Supabase (Database + Storage)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- A Supabase account

### Setup

1. **Clone and install**
   ```bash
   git clone <your-repo>
   cd vault
   npm install
   ```

2. **Configure Supabase**
   - Follow the detailed setup guide in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
   - Copy `.env.example` to `.env` and fill in your Supabase credentials

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📋 Setup Requirements

### Supabase Configuration
You'll need to:
1. Create a Supabase project
2. Set up the files table in your database
3. Create a storage bucket named `files`
4. Configure your environment variables

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions.

### Environment Variables
```env
VITE_STORAGE_PROVIDER=supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_PASSWORD=your_secure_password
```

## 🔒 Security Notes

- This app uses a simple password protection mechanism
- For production use, consider implementing proper authentication
- Review and adjust Supabase Row Level Security policies
- Keep your environment variables secure

## 📝 License

This project is for personal/educational use.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!