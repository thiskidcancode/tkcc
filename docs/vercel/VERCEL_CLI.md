# Vercel CLI Guide for TKCC

## Project Configuration

**Team**: `thiskidcancodes-projects`  
**Project**: `tkcc-marketing-site`  
**Production URL**: https://tkcc-marketing-site-thiskidcancodes-projects.vercel.app  
**Staging URL**: https://staging.thiskidcancode.com

## Authentication

Check current user:
```bash
vercel whoami
```

List available teams:
```bash
vercel teams ls
```

## Essential Commands

### Deployments

List all deployments:
```bash
vercel ls tkcc-marketing-site --scope thiskidcancodes-projects
```

View deployment logs:
```bash
vercel logs [deployment-url] --scope thiskidcancodes-projects
```

### Environment Variables

List environment variables:
```bash
vercel env ls --scope thiskidcancodes-projects
```

Add environment variable:
```bash
vercel env add [VARIABLE_NAME] --scope thiskidcancodes-projects
```

### Project Management

List projects:
```bash
vercel project ls --scope thiskidcancodes-projects
```

## Important Notes

### Team Scope Required
All commands must include `--scope thiskidcancodes-projects` because the project is under a team account, not a personal account.

### Project Name Mismatch
- Local project is linked to: `marketing-site`
- Actual Vercel project is: `tkcc-marketing-site`
- Always use `tkcc-marketing-site` in CLI commands

### Branch Deployments
- `develop` branch → Preview environment (staging.thiskidcancode.com)
- `main` branch → Production environment

## Common Issues

### "No deployments found"
This happens when:
- Missing `--scope thiskidcancodes-projects`
- Using wrong project name (`marketing-site` vs `tkcc-marketing-site`)

### Solution
Always use the full command format:
```bash
vercel [command] tkcc-marketing-site --scope thiskidcancodes-projects
```

## Quick Reference

| Task | Command |
|------|---------|
| View deployments | `vercel ls tkcc-marketing-site --scope thiskidcancodes-projects` |
| Check logs | `vercel logs [url] --scope thiskidcancodes-projects` |
| List env vars | `vercel env ls --scope thiskidcancodes-projects` |
| Add env var | `vercel env add [NAME] --scope thiskidcancodes-projects` |
| View projects | `vercel project ls --scope thiskidcancodes-projects` |

## Database Per Branch

Each branch has its own database:
- **develop**: Preview database with staging data
- **main**: Production database with live data

Access staging database via Vercel Storage tab → Preview environment.