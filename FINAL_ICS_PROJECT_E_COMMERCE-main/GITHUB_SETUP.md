# How to Connect Your Project to GitHub

## Step 1: Create a GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name**: `farmdirect-ecommerce` (or any name you prefer)
   - **Description**: "FarmDirect E-Commerce Platform - Full Stack Application"
   - **Visibility**: Choose Public (for free hosting) or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have files)
5. Click **"Create repository"**

## Step 2: Initialize Git in Your Project (if not already done)

Open your terminal/PowerShell in the project root directory:
```
C:\Users\nicol\Downloads\FINAL_ICS_PROJECT_E_COMMERCE-main\FINAL_ICS_PROJECT_E_COMMERCE-main
```

Run these commands:

```bash
# Check if git is already initialized
git status

# If you get an error, initialize git:
git init

# Add all files to staging
git add .

# Create your first commit
git commit -m "Initial commit: FarmDirect E-Commerce Platform"
```

## Step 3: Connect to GitHub Repository

After creating the repository on GitHub, GitHub will show you setup instructions. Use these commands:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/farmdirect-ecommerce.git

# Verify the remote was added
git remote -v

# Push your code to GitHub
git branch -M main
git push -u origin main
```

## Step 4: Verify Connection

1. Go back to your GitHub repository page
2. Refresh the page
3. You should see all your project files uploaded

## Troubleshooting

### If you get authentication errors:
You may need to set up authentication. Options:

**Option 1: Personal Access Token (Recommended)**
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name and select scopes: `repo` (full control)
4. Copy the token
5. When pushing, use token as password:
```bash
git push -u origin main
# Username: your-github-username
# Password: paste-your-token-here
```

**Option 2: GitHub CLI**
```bash
# Install GitHub CLI, then:
gh auth login
```

**Option 3: SSH (Advanced)**
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"
# Then add to GitHub → Settings → SSH and GPG keys
```

## Common Commands for Future Updates

```bash
# Check status
git status

# See what changed
git diff

# Add changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main
```

## Next Steps After Connecting

Once your code is on GitHub, you can:
1. ✅ Deploy backend to Render (connect GitHub repo)
2. ✅ Deploy frontend to Vercel (connect GitHub repo)
3. ✅ Set up automatic deployments on every push

