# GitHub LFS + GitHub Pages Deployment Guide

## 🚀 Quick Setup

### 1. Create GitHub Repository
```bash
# Create a new repository on GitHub (can be private!)
# Repository name: fileupload (or any name you prefer)
```

### 2. Generate GitHub Personal Access Token
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Select scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
4. Copy the token (you'll need it for environment variables)

### 3. Set Environment Variables
Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_STORAGE_PROVIDER=github
VITE_GITHUB_OWNER=your-github-username
VITE_GITHUB_REPO=fileupload
VITE_GITHUB_TOKEN=your-personal-access-token
VITE_GITHUB_BRANCH=main
VITE_APP_PASSWORD=your-secure-password-2024
```

### 4. Initialize Git and LFS
```bash
# Initialize repository
git init
git lfs track "*.pdf" "*.zip" "*.doc*" "*.ppt*" "*.xls*"
git add .gitattributes

# Add all files
git add .
git commit -m "Initial commit: File upload system with GitHub LFS"

# Connect to GitHub
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/fileupload.git
git push -u origin main
```

### 5. Configure GitHub Repository Settings

#### Enable GitHub Pages:
1. Go to your repository → Settings → Pages
2. Source: Deploy from a branch
3. Branch: `gh-pages` / `root`
4. Save

#### Add Repository Secrets:
1. Go to your repository → Settings → Secrets and variables → Actions
2. Add secrets:
   - `APP_PASSWORD`: Your secure password
   - `GITHUB_TOKEN`: Will be automatically available

### 6. Deploy
```bash
# Push to trigger deployment
git push origin main
```

## 📝 How It Works

### GitHub LFS Storage:
- Large files (PDFs, images, etc.) stored in GitHub LFS
- Small text files stored directly in repository
- 1GB free LFS storage per account
- Additional storage: $5/month for 50GB

### GitHub Pages Hosting:
- Static site hosted on GitHub Pages
- Automatic deployment via GitHub Actions
- Free for public and private repositories
- Custom domain support available

### File Upload Process:
1. File uploaded via drag & drop or file picker
2. File converted to base64 and uploaded to GitHub repository
3. Large files automatically tracked by LFS
4. Files stored in `/uploads` folder in your repository

## 🔐 Security Features

- **Password Protection**: Simple password authentication
- **Private Repository**: Source code remains private
- **Token-based Access**: GitHub API access via personal tokens
- **File Size Limits**: 10MB per file limit implemented

## 🛠️ Customization

### Change Storage Provider:
Edit `.env`:
```env
VITE_STORAGE_PROVIDER=supabase  # Switch back to Supabase
```

### Adjust File Size Limits:
Edit `src/components/FileUpload.tsx`:
```typescript
const maxSize = 50 * 1024 * 1024; // Change to 50MB
```

### Modify File Types:
Edit `accept` attribute in `FileUpload.tsx` and update GitHub LFS tracking in `.gitattributes`

## 📊 Usage Monitoring

### Check GitHub LFS Usage:
```bash
git lfs ls-files
```

### Repository Storage:
- GitHub repository: Files, code, metadata
- GitHub LFS: Large files (separate quota)
- GitHub Pages: Generated static site

## 🆘 Troubleshooting

### Common Issues:
1. **Build fails**: Check environment variables in GitHub secrets
2. **Upload fails**: Verify GitHub token permissions
3. **Large files fail**: Ensure Git LFS is properly set up
4. **Page not loading**: Check GitHub Pages settings and base URL

### Debug Commands:
```bash
# Check LFS status
git lfs status

# Verify remote
git remote -v

# Check GitHub Actions logs in repository → Actions tab
```

## 🎯 Your File Upload URL

After deployment, your app will be available at:
```
https://YOUR_USERNAME.github.io/fileupload/
```

**Perfect for college use**: Access your files from any computer using this URL + your password!