# Package Manager Rule

## Use pnpm exclusively

- Always use `pnpm` instead of `npm` or `yarn`
- When suggesting package installation: `pnpm install <package>`
- When suggesting script execution: `pnpm run <script>`
- When suggesting package addition: `pnpm add <package>`
- When suggesting dev dependencies: `pnpm add -D <package>`
- Never suggest `npm install`, `npm run`, `yarn install`, or `yarn add`

This project uses pnpm as the package manager for all workspaces.