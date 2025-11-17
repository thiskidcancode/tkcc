#!/bin/bash

# Pre-push hook to enforce branch naming convention
# Place in .git/hooks/pre-push and make executable

protected_branch='main'
current_branch=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')

# Skip check for main branch
if [ "$current_branch" = "$protected_branch" ]; then
    exit 0
fi

# Check branch naming convention
if [[ ! "$current_branch" =~ ^(feat|fix|docs|chore|test|refactor)/[0-9]+-[a-z0-9-]+$ ]]; then
    echo ""
    echo "❌ Branch name '$current_branch' doesn't follow our naming convention!"
    echo ""
    echo "Required format: type/issue-number-description"
    echo ""
    echo "Examples:"
    echo "  feat/123-student-dashboard"
    echo "  fix/456-payment-bug" 
    echo "  docs/789-api-documentation"
    echo ""
    echo "To fix:"
    echo "  1. Create GitHub issue if needed"
    echo "  2. Rename branch: git branch -m $current_branch type/issue-number-description"
    echo "  3. Try push again"
    echo ""
    echo "See docs/git/GIT_SOP.md for details."
    echo ""
    exit 1
fi

echo "✅ Branch name follows convention: $current_branch"
exit 0