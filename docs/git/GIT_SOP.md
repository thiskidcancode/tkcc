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
fix(env): update production Stripe API version to 2025-02-24.acacia
feat(deploy): configure custom domain thiskidcancode.com
fix(config): remove static export to enable API routes for Vercel
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
- `config` - Configuration files
- `env` - Environment variables and settings
- `deploy` - Deployment-related changes

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

#### Standard Format

- `feat/feature-name` - New features  
- `fix/bug-description` - Bug fixes
- `docs/update-readme` - Documentation
- `chore/update-deps` - Maintenance
- `copilot/issue-number-description` - **GitHub Copilot agent work**

#### GitHub Issue Integration

**Recommended Format:** `type/issue-number-brief-description`

```bash
# Human developer work
feat/123-student-progress-dashboard
fix/456-mobile-navigation-bug
docs/789-api-documentation-update
chore/101-dependency-security-updates

# GitHub Copilot agent work  
copilot/234-analytics-api-endpoints
copilot/235-test-coverage-suite
copilot/236-progress-dashboard-component
```

#### Branch Visibility Benefits

**At a glance identification:**
- `feat/` = Human developer feature work
- `copilot/` = AI agent automated work  
- `fix/` = Human bug fixes
- Easy to filter: `git branch | grep copilot`

#### Issue-to-Branch Workflow

1. **Create GitHub Issue first** - Define scope and requirements
2. **Reference issue number in branch name** - Enables automatic linking
3. **Include brief description** - Makes branches self-documenting

```bash
# Human Developer Workflow
# Step 1: Create issue #234 "Add Stripe payment integration"  
# Step 2: Create branch
git checkout -b feat/234-stripe-payment-integration

# Step 3: Commits automatically link to issue
git commit -m "feat(marketing): add Stripe checkout session creation

Implements payment flow for issue #234"

# GitHub Copilot Agent Workflow
# Step 1: Create issue with 'copilot-agent' label
# Step 2: Assign copilot to issue
gh issue assign 235 --assignee "app/github-copilot"  
# Step 3: Copilot creates branch automatically
# Result: copilot/235-analytics-api-endpoints
```

#### Automatic Issue Linking

**Branch names** automatically link to issues:

- `feat/123-feature-name` → Links to issue #123
- Commits show in issue timeline
- PR automatically references issue

**Commit messages** can close issues:

```bash
git commit -m "fix(marketing): resolve mobile overflow

Closes #456"
```

**Keywords that close issues:**

- `Closes #123` or `Fixes #123`
- `Resolves #123` or `Resolv #123`
- `Fix #123` or `Close #123`

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

## 🚀 GitHub Integration & Deployment

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

### GitHub CLI Integration (Recommended)

> **📚 See also:** [GITHUB_CLI.md](./GITHUB_CLI.md) for authentication troubleshooting and label management

**Streamlined issue-to-PR workflow:**

```bash
# 1. List and view issues
gh issue list
gh issue view 123

# 2. Create branch from issue
gh issue develop 123 --checkout

# 3. Create PR that links to issue
gh pr create --title "Add payment integration" --body "Closes #123"

# 4. Auto-merge when ready
gh pr merge --squash --delete-branch
```

**Issue management:**

```bash
# Create issue (see GITHUB_CLI.md for auth setup)
env -u GH_TOKEN gh issue create --title "Add student dashboard" --body "Need progress tracking"

# Create branch from new issue
gh issue develop --checkout

# Close issue via commit
git commit -m "feat(apprenticeship): add student dashboard

Fixes #$(gh issue list --limit 1 --json number --jq '.[0].number')"
```

**⚠️ Important:** Create labels before using them in issues. See [GITHUB_CLI.md](./GITHUB_CLI.md) for required label setup.

### Deployment Workflow

#### Vercel Integration

- **Automatic deployments** trigger on push to `main`
- **Preview deployments** created for all pull requests
- **Custom domain** configured with proper DNS (A and CNAME records)

#### Environment-Specific Commits

```bash
# Environment configuration changes
fix(env): update production Stripe API keys
feat(deploy): add custom domain configuration
fix(config): correct NEXT_PUBLIC_SITE_URL for production

# Infrastructure changes
feat(infrastructure): add Route 53 DNS configuration
fix(infrastructure): update Vercel deployment settings
```

#### Production Deployment Checklist

- [ ] Environment variables configured in Vercel dashboard
- [ ] DNS records properly configured (A and CNAME)
- [ ] SSL certificates provisioned and valid
- [ ] API endpoints tested with production keys
- [ ] Success/cancel URLs point to custom domain

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
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [
      2,
      "always",
      [
        "apprenticeship",
        "marketing",
        "curriculum",
        "community",
        "infrastructure",
        "mobile",
        "config",
        "env",
        "deploy",
      ],
    ],
  },
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
  
  # Issue-driven development aliases
  issue-branch = "!f() { gh issue develop $1 --checkout; }; f"
  issue-list = "!gh issue list"
  pr-for-issue = "!f() { gh pr create --title \"$(gh issue view $1 --json title --jq .title)\" --body \"Closes #$1\"; }; f"
  
  # AI/Human workflow aliases
  copilot-branches = "!git branch -r | grep copilot/"
  copilot-prs = "!gh pr list --author app/github-copilot"
  human-prs = "!gh pr list --author @me"
  ai-issues = "!gh issue list --label copilot-agent"
```## 🎯 Educational Platform Best Practices

### Student-Friendly Commits

Since our platform teaches kids to code, model good practices:

```bash
# Good examples for students to see
feat(wizard): add celebration confetti when quest completes
fix(wizard): ensure progress saves between browser sessions
docs(readme): add step-by-step setup for new contributors
```

### Issue-Driven Development for Education

**Model good project management:**

```bash
# 1. Create descriptive issues for features
Issue #123: "Add coding achievement badges for students"
Issue #124: "Fix mobile menu accessibility for screen readers"

# 2. Use issue templates for consistency
- Bug Report Template
- Feature Request Template
- Student Feedback Template

# 3. Branch names tell the story
feat/123-achievement-badges-system
fix/124-mobile-accessibility-improvements

# 4. PRs reference learning objectives
"This PR implements achievement badges (Issue #123) to help students
track their coding progress and stay motivated."
```

**Educational Issue Labels:**

- `student-facing` - Features students directly interact with
- `educator-tools` - Features for teachers and mentors  
- `accessibility` - Ensuring platform works for all learners
- `performance` - Optimizations for better learning experience
- `bug-student-reported` - Issues discovered by student users
- `ux-issue` - User experience problems
- `security` - Security-related issues
- `high-priority` / `medium-priority` - Priority levels
- `copilot-agent` - **Work suitable for AI automation**

> **💡 Setup:** Labels must be created before use. See [GITHUB_CLI.md](./GITHUB_CLI.md) for label creation commands.

### AI/Human Workflow Management

**Branch Organization by Author:**
```bash
# View all branches by type
git branch -r | grep "feat/"     # Human features
git branch -r | grep "copilot/"  # AI agent work  
git branch -r | grep "fix/"      # Human bug fixes

# GitHub CLI filtering
gh pr list --author "@me"        # Your PRs
gh pr list --author "app/github-copilot"  # AI PRs
gh pr list --label "copilot-agent"        # AI-labeled work
```

**Review Strategies:**
- **AI PRs**: Focus on logic, edge cases, and integration
- **Human PRs**: Standard code review process
- **Mixed work**: Clearly document AI vs human contributions

### Branch Protection Rules

Configure in GitHub repository settings:

- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass (tests, linting)
- ✅ Require branches to be up to date before merging
- ✅ Restrict pushes to main branch
- ✅ Require signed commits (recommended)
- ✅ Require Vercel deployment checks to pass
- ✅ Block merge if deployment preview fails

### Recommended Branch Strategy

```bash
# Production branch (main)
main -> Vercel Production (thiskidcancode.com)

# Development branch (future)
develop -> Vercel Preview (staging deployments)

# Feature branches
feat/* -> Vercel Preview (per-PR deployments)
```

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

### Project Documentation

- [GitHub CLI Setup & Troubleshooting](./GITHUB_CLI.md) - Authentication, labels, and issue creation

### External References

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Semantic Versioning](https://semver.org/)
- [GitHub CLI Documentation](https://cli.github.com/manual/)

---

_This ensures our educational components maintain high quality through clean git history! 🚀_
