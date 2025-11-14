# GitHub CLI Authentication Troubleshooting

## IMPORTANT: Create Labels Before Using

**Labels must be created before they can be used in issues.** GitHub CLI will fail if you reference non-existent labels.

### Create Required Labels First

```bash
# Create labels (required before using in issues)
env -u GH_TOKEN gh label create "cache-invalidation" --description "Frontend cache invalidation issues" --color "ff6b6b"
env -u GH_TOKEN gh label create "platform-admin" --description "Platform admin functionality" --color "4ecdc4"
env -u GH_TOKEN gh label create "security" --description "Security-related issues" --color "ff4757"
env -u GH_TOKEN gh label create "ux-issue" --description "User experience problems" --color "ffa502"
env -u GH_TOKEN gh label create "high-priority" --description "High priority issues" --color "ff3838"
env -u GH_TOKEN gh label create "medium-priority" --description "Medium priority issues" --color "ffa502"
```

### Add Labels to Existing Issues

```bash
env -u GH_TOKEN gh issue edit <issue-number> --add-label "label1,label2,label3"
```

### Create Issue with Labels (after labels exist)

```bash
env -u GH_TOKEN gh issue create --title "Title" --body-file file.md --label "label1,label2"
```

## Problem: GH_TOKEN Environment Variable Conflicts

When creating GitHub issues via `gh issue create`, encountered authentication failures due to conflicting token configurations.

## Error Symptoms

```bash
# Initial attempt failed
gh issue create --title "..." --body-file file.md --assignee "@me"
# Error: failed resolving `@me`: 401 Unauthorized

# Token status showed conflicts
gh auth status
# Output: The token in GH_TOKEN is invalid
#         ✓ Logged in to github.com account JohnRuffin (keyring)
#         - Active account: false
```

## Root Cause

GitHub CLI was using an invalid `GH_TOKEN` environment variable instead of the valid keyring-stored credentials.

## Solution: Environment Variable Override

Use `env -u GH_TOKEN` to temporarily unset the problematic environment variable:

```bash
# ❌ Failed - uses invalid GH_TOKEN
gh issue create --title "Product Boost Management - Backend API" --body-file boost-management-backend.md

# ✅ Success - bypasses GH_TOKEN
env -u GH_TOKEN gh issue create --title "Product Boost Management - Backend API" --body-file boost-management-backend.md
```

## Working Commands

```bash
# Step 1: Create labels first (if they don't exist)
env -u GH_TOKEN gh label create "cache-invalidation" --description "Frontend cache invalidation issues" --color "ff6b6b"
env -u GH_TOKEN gh label create "platform-admin" --description "Platform admin functionality" --color "4ecdc4"
env -u GH_TOKEN gh label create "security" --description "Security-related issues" --color "ff4757"
env -u GH_TOKEN gh label create "ux-issue" --description "User experience problems" --color "ffa502"
env -u GH_TOKEN gh label create "high-priority" --description "High priority issues" --color "ff3838"
env -u GH_TOKEN gh label create "medium-priority" --description "Medium priority issues" --color "ffa502"

# Step 2: Create issues with labels (after labels exist)
env -u GH_TOKEN gh issue create --title "Frontend Cache Invalidation System" --body-file cache-invalidation-issue.md --label "cache-invalidation,security,ux-issue,high-priority"
env -u GH_TOKEN gh issue create --title "Platform Admin Service Implementation" --body-file platform-admin-service.md --label "platform-admin,security,medium-priority"
```

## Results

Successfully created GitHub issues with proper labeling:

- Cache Invalidation System (labels: cache-invalidation, security, ux-issue, high-priority)
- Platform Admin Service (labels: platform-admin, security, medium-priority)

**Note:** Labels must exist before creating issues that reference them.

## Prevention

To avoid this issue in the future:

1. **Check auth status first**: `gh auth status`
2. **Clear invalid tokens**: `unset GH_TOKEN` in shell profile
3. **Use keyring auth**: `gh auth login` with keyring storage
4. **Test with simple command**: `gh repo view` before bulk operations

## Alternative Solutions

```bash
# Method 1: Unset in current session
unset GH_TOKEN
gh issue create --title "..." --body-file file.md

# Method 2: Override per command
env -u GH_TOKEN gh issue create --title "..." --body-file file.md

# Method 3: Use different auth method
gh auth switch --user username
```

The `env -u GH_TOKEN` approach was most reliable for immediate issue creation without affecting global environment settings.
