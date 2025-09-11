# Personal File Storage

A secure, modern file upload system built with React, TypeScript, and your choice of storage backend. Upload files from home and access them from anywhere with password protection.

## 🚀 Features

- **Drag & Drop Upload** - Easy file uploading with visual feedback
- **File Preview** - Preview text files, code, and documents
- **Theme Toggle** - Dark/Light mode support
- **Password Protection** - Simple authentication to keep files private
- **Responsive Design** - Works on desktop and mobile
- **File Management** - Download, preview, and organize files
- **Dual Storage Options** - Choose between Supabase or GitHub LFS

## 🛠️ Tech Stack

- **Frontend**: React 18.3.1 + TypeScript 5.5.3
- **Build Tool**: Vite 5.4.2
- **Styling**: Tailwind CSS 3.4.1
- **Icons**: Lucide React 0.344.0
- **Storage Options**: 
  - Supabase (Database + Storage)
  - GitHub LFS (Git Large File Storage)
- **Deployment**: 
  - Vercel (for Supabase)
  - GitHub Pages (for GitHub LFS)

## 🏃‍♂️ Quick Start

1. **Clone and Install**:
   ```bash
   git clone <your-repo-url>
   cd fileupload
   npm install
   ```

2. **Environment Setup**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your values:
   ```
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_APP_PASSWORD=your-secure-password
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 🚀 Deployment Options

### Option 1: GitHub LFS + GitHub Pages (Recommended)
**Perfect for college use - Free hosting with private repos!**

```bash
# Quick setup
npm install
cp .env.example .env
# Edit .env with GitHub settings
npm run build
```

📖 **[Complete GitHub LFS Setup Guide](./DEPLOY_GITHUB.md)**

**Benefits:**
- ✅ Free hosting on GitHub Pages
- ✅ Private repository support
- ✅ 1GB free LFS storage
- ✅ No backend setup required
- ✅ Perfect for file sharing between devices

### Option 2: Supabase + Vercel
**For more advanced database features**

```bash
# Setup
npm install
cp .env.example .env
# Edit .env with Supabase settings
npm run dev
```

**Benefits:**
- ✅ Real-time database
- ✅ Advanced querying
- ✅ User authentication
- ✅ Edge functions support

## ⚙️ Configuration

### Storage Provider Selection
Choose your storage backend in `.env`:

```env
# For GitHub LFS (Recommended for college use)
VITE_STORAGE_PROVIDER=github
VITE_GITHUB_OWNER=your-username
VITE_GITHUB_REPO=your-repo-name
VITE_GITHUB_TOKEN=your-personal-access-token
VITE_APP_PASSWORD=your-secure-password

# For Supabase
VITE_STORAGE_PROVIDER=supabase
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-key
VITE_APP_PASSWORD=your-secure-password
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📝 License

This project is for personal/educational use.