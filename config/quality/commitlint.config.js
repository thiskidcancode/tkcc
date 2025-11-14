module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation changes
        'style',    // Code style changes (formatting, etc.)
        'refactor', // Code refactoring
        'perf',     // Performance improvements
        'test',     // Adding or updating tests
        'build',    // Build system or external dependencies
        'ci',       // CI/CD changes
        'chore',    // Other changes (maintenance, etc.)
        'revert',   // Revert previous commit
        'security', // Security fixes
        'content',  // Curriculum or educational content changes
      ],
    ],
    'scope-enum': [
      2,
      'always',
      [
        'apprenticeship', // apprenticeship-platform workspace
        'marketing',      // marketing-site workspace
        'curriculum',     // curriculum workspace
        'community',      // community-tools workspace
        'mobile',         // mobile-app workspace
        'infrastructure', // infrastructure workspace
        'docs',           // documentation
        'deps',           // dependencies
        'config',         // configuration files
        'security',       // security-related changes
        'release',        // release-related changes
      ],
    ],
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],
    'subject-max-length': [2, 'always', 72],
    'body-max-line-length': [2, 'always', 100],
  },
};