# Contributing to TKCC

## 🚀 Quick Start (No AWS Required)

```bash
# 1. Clone and install
git clone https://github.com/thiskidcancode/tkcc.git
cd tkcc
pnpm install

# 2. Run marketing site locally
cd marketing-site
pnpm run dev
# Opens http://localhost:3000
```

That's it! The marketing site runs completely locally with mock data.

## 🛠️ Development Environments

### Local Development (Default)
- **No AWS account needed**
- **No Stripe keys needed** - payments are mocked
- All features work with local mock data

### Full Integration Testing (Optional)
Only needed if you're working on payment flows or infrastructure:

```bash
# Copy example environment
cp .env.example .env.local

# Add your test Stripe key (optional)
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

## 📁 Project Structure

```
tkcc/
├── marketing-site/        # 👈 Start here - public website
├── apprenticeship-platform/  # Student learning experience  
├── curriculum/            # Quest-based CS curriculum
├── infrastructure/        # 🔒 AWS deployment (maintainers only)
└── docs/                  # Documentation
```

## 🤝 Making Changes

### 1. Pick Your Area
- **Marketing site**: Landing pages, SEO, design
- **Curriculum**: Educational content, quests
- **Platform**: Student dashboard, progress tracking
- **Docs**: Guides, tutorials, API docs

### 2. Development Workflow
```bash
# Create feature branch
git checkout -b feat/improve-landing-page

# Make changes and test locally
pnpm run dev

# Commit with Commitizen (interactive)
pnpm run commit

# Push and create PR
git push origin feat/improve-landing-page
```

### 3. PR Preview
Every PR gets an automatic Netlify preview - no setup required!

## 🔒 Infrastructure (Maintainers Only)

The `infrastructure/` directory is for core maintainers deploying to AWS. Contributors don't need to touch this unless specifically working on deployment features.

## 💡 Need Help?

- 🐛 **Bug reports**: Use GitHub Issues
- 💬 **Questions**: Start a GitHub Discussion  
- 🚀 **Feature ideas**: Create an Issue with the enhancement label

## 📋 Code Standards

- **TypeScript**: Strict mode enabled
- **Formatting**: Prettier (runs on commit)
- **Linting**: ESLint (runs on commit)
- **Testing**: Jest for unit tests
- **Commits**: Conventional commits via Commitizen