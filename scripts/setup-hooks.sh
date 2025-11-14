#!/bin/bash

# TKCC Pre-commit Hooks Setup Script
# Professional-grade security and quality checks for educational platform

set -e

echo "🚀 Setting up TKCC pre-commit hooks..."

# Check if pre-commit is installed
if ! command -v pre-commit &> /dev/null; then
    echo "📦 Installing pre-commit..."
    if command -v pip &> /dev/null; then
        pip install pre-commit
    elif command -v pip3 &> /dev/null; then
        pip3 install pre-commit
    else
        echo "❌ Error: pip not found. Please install Python and pip first."
        exit 1
    fi
fi

# Install pre-commit hooks
echo "🔧 Installing pre-commit hooks..."
pre-commit install
pre-commit install --hook-type commit-msg

# Run initial check
echo "✅ Running initial pre-commit check..."
pre-commit run --all-files || {
    echo "⚠️  Some files needed formatting. They have been automatically fixed."
    echo "📝 Please review the changes and commit them."
}

echo "🎉 Pre-commit hooks successfully installed!"
echo ""
echo "🛡️  Security and quality checks now active:"
echo "   • AWS credential detection"
echo "   • Private key detection" 
echo "   • Code formatting (Prettier)"
echo "   • TypeScript/JavaScript linting"
echo "   • Markdown quality checks"
echo "   • Conventional commit messages (commitlint)"
echo "   • Large file prevention"
echo ""
echo "📝 Use interactive commits: pnpm run commit"
echo "💡 To bypass hooks (emergency only): git commit --no-verify"