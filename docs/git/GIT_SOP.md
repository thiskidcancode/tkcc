# Git Standard Operating Procedures (SOP)

## Overview

This document outlines git workflows and best practices for the ThisKidCanCode platform. We use conventional commits and a feature branch workflow to maintain clean, educational-friendly code history.

## 📝 Commit Message Standards

### Conventional Commits Format

```
type(scope): description
```

### Examples

```bash
feat(apprenticeship): add coding adventure wizard component
fix(marketing): resolve mobile navigation overflow
docs(curriculum): update JavaScript fundamentals guide
chore(deps): update dependencies across workspaces
```

### Commit Types

- **feat**: New features
- **fix**: Bug fixes
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Scopes (Workspaces)

- `apprenticeship` - Apprenticeship platform
- `marketing` - Marketing website
- `curriculum` - Learning content
- `infrastructure` - AWS/CDK infrastructure
- `community` - Community tools
- `mobile` - Mobile app

## 🔄 Branching Strategy

### Feature Branch Workflow

1. **Create feature branch from main**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feat/github-superhero-quest
   ```

2. **Work in small, focused commits**
   ```bash
   git add src/components/GitHubQuest.tsx
   git commit -m "feat(apprenticeship): add GitHub account creation flow"
   
   git add src/components/GitHubQuest.test.tsx
   git commit -m "test(apprenticeship): add GitHub quest component tests"
   ```

3. **Rebase before merge to clean up history**
   ```bash
   git rebase main
   git push origin feat/github-superhero-quest
   ```

### Branch Naming Convention

- `feat/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/update-readme` - Documentation
- `chore/update-deps` - Maintenance

## 🧹 History Cleanup Techniques

### Interactive Rebase (Before Pushing)

```bash
# Clean up last 3 commits
git rebase -i HEAD~3
```

**Rebase Options:**
- `pick` - Keep commit as-is
- `squash` - Combine with previous commit
- `reword` - Change commit message
- `drop` - Remove commit entirely

### Squashing Related Commits

**Before:**
```bash
fix(apprenticeship): add button component
fix(apprenticeship): fix button styling
fix(apprenticeship): update button tests
```

**After squashing:**
```bash
feat(apprenticeship): add interactive button component with tests
```

## 📝 Workspace-Specific Strategies

### Monorepo Commit Scoping

```bash
git commit -m "feat(apprenticeship): add coding wizard progress tracking"
git commit -m "fix(marketing): resolve hero section on mobile"
git commit -m "docs(curriculum): add JavaScript arrays lesson"
git commit -m "chore(infrastructure): update CDK to v2.100.0"
```

### Atomic Commits by Workspace

**❌ Don't mix workspaces:**
```bash
git add apprenticeship-platform/ marketing-site/
git commit -m "fix various issues"
```

**✅ Separate commits per workspace:**
```bash
git add apprenticeship-platform/src/components/
git commit -m "feat(apprenticeship): add progress celebration animations"

git add marketing-site/src/pages/
git commit -m "feat(marketing): add testimonials section"
```

## 🚀 GitHub Integration

### Pull Request Strategy

1. **Create focused PR with clean history**
   ```bash
   git checkout -b feat/device-detective-enhancement
   # ... make focused changes ...
   git push origin feat/device-detective-enhancement
   ```

2. **Use PR template** - Fill out the provided template completely
3. **Request reviews** - Get at least one review before merging
4. **Squash and merge** - Keep main branch history clean

### Pre-commit Hooks

Add to root `package.json`:
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

## 🔧 Tools & Configuration

### Commitlint Config

Create `config/quality/commitlint.config.js`:
```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', [
      'apprenticeship',
      'marketing',
      'curriculum',
      'community',
      'infrastructure',
      'mobile'
    ]]
  }
};
```

### Git Aliases for Clean History

Add to `~/.gitconfig`:
```ini
[alias]
  hist = log --oneline --graph --decorate --all
  squash = merge --squash
  pushf = push --force-with-lease
  cleanup = !git branch --merged | grep -v "\*\|main\|develop" | xargs -n 1 git branch -d
```

## 🎯 Educational Platform Best Practices

### Student-Friendly Commits

Since our platform teaches kids to code, model good practices:

```bash
# Good examples for students to see
feat(wizard): add celebration confetti when quest completes
fix(wizard): ensure progress saves between browser sessions
docs(readme): add step-by-step setup for new contributors
```

### Branch Protection Rules

Configure in GitHub repository settings:

- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass (tests, linting)
- ✅ Require branches to be up to date before merging
- ✅ Restrict pushes to main branch
- ✅ Require signed commits (recommended)

## 🚨 Emergency Procedures

### Hotfix Workflow

```bash
# Create hotfix from main
git checkout main
git checkout -b hotfix/critical-security-fix

# Make minimal fix
git commit -m "fix(security): patch XSS vulnerability in user input"

# Fast-track review and merge
```

### Rollback Procedures

```bash
# Revert specific commit
git revert <commit-hash>

# Revert merge commit
git revert -m 1 <merge-commit-hash>
```

## 📚 Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Semantic Versioning](https://semver.org/)

---

*This ensures our educational components maintain high quality through clean git history! 🚀*
