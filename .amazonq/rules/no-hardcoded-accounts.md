# No Hardcoded AWS Account Numbers

## Rule: Never hardcode AWS account numbers in source code

### ❌ Bad Examples:
```typescript
// DON'T DO THIS
const account = '123456789012';
const roleArn = 'arn:aws:iam::123456789012:role/MyRole';
const oidcProvider = 'arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com';
```

### ✅ Good Examples:
```typescript
// Use environment variables
const account = process.env.CDK_STAGING_ACCOUNT;

// Use CDK context
const account = app.node.tryGetContext('stagingAccount');

// Use dynamic references
const roleArn = `arn:aws:iam::${this.account}:role/MyRole`;
```

### Implementation:
- Use `process.env.CDK_STAGING_ACCOUNT` and `process.env.CDK_PRODUCTION_ACCOUNT`
- Use CDK context: `--context stagingAccount=123456789012`
- Use `${this.account}` in CDK constructs for dynamic account references
- Document account setup in README.md

### Security Rationale:
- Prevents accidental exposure of account numbers in open source
- Allows different contributors to use their own AWS accounts
- Enables secure CI/CD without hardcoded credentials