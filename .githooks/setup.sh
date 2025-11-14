#!/bin/bash

# Setup git hooks for ThisKidCanCode project

echo "🔧 Setting up git hooks..."

# Configure git to use .githooks directory
git config core.hooksPath .githooks

# Make hooks executable
chmod +x .githooks/*

echo "✅ Git hooks configured!"
echo "💡 Run 'git commit --no-verify' to bypass security checks if needed"