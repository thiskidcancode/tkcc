# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Adventure-themed marketing site with donation functionality
- AWS CDK infrastructure for production deployment
- Monorepo structure with pnpm workspaces
- GitHub Actions CI/CD pipeline
- Open-source project structure (LICENSE, CONTRIBUTING, CODE_OF_CONDUCT)

### Changed
- Migrated from old AWS account to new production account
- Updated DNS configuration for thiskidcancode.com

### Infrastructure
- S3 bucket for static site hosting
- CloudFront distribution for global CDN
- Route 53 hosted zone management
- Email records preservation during migration

## [1.0.0] - 2024-11-05

### Added
- Initial monorepo setup
- Marketing site workspace
- Apprenticeship platform workspace
- Infrastructure workspace with AWS CDK

---

**Legend:**
- `Added` for new features
- `Changed` for changes in existing functionality  
- `Deprecated` for soon-to-be removed features
- `Removed` for now removed features
- `Fixed` for any bug fixes
- `Security` for vulnerability fixes