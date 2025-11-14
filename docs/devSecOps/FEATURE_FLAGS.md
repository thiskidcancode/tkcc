# Feature Flags Operations Guide 🚩

Comprehensive guide for managing feature flags in the ThisKidCanCode platform.

## Overview

Feature flags enable safe, age-appropriate rollouts of new learning features while maintaining platform stability for our student users (ages 11-18).

## Architecture

```
Feature Flag Decision Flow:
1. Emergency Override (env vars) → Instant disable
2. Age Gate Check → COPPA compliance  
3. Progress Gate Check → Skill-based unlock
4. Parental Consent → Social features
5. Environment Override → Dev/staging control
```

## Feature Categories

### Core Learning Features
- `coding-hints` - Basic help system (Age: 11+, Quests: 0)
- `ai-coding-assistant` - AI-powered help (Age: 12+, Quests: 5)
- `step-by-step-debugging` - Debug guidance (Age: 13+, Quests: 10)

### Social Features (Require Parental Consent)
- `peer-code-review` - Student code reviews (Age: 14+, Quests: 25)
- `community-challenges` - Group coding challenges (Age: 14+, Quests: 15)
- `mentor-chat` - Direct mentor communication (Age: 15+, Quests: 20)

### Advanced Features
- `github-integration` - Real GitHub repos (Age: 16+, Quests: 30)
- `open-source-contributions` - OSS projects (Age: 17+, Quests: 50)
- `advanced-algorithms` - Complex CS topics (Age: 16+, Quests: 40)

### Experimental Features
- `new-quest-flow` - Updated learning path (Age: 11+, Quests: 0)
- `gamification-v2` - Enhanced rewards (Age: 11+, Quests: 0)

## Operations Procedures

### 🚨 Emergency Disable (Immediate)

**Scenario:** Feature is broken and affecting students

```bash
# Method 1: Environment Variable (Fastest)
export FEATURE_AI_CODING_ASSISTANT=false

# Method 2: Multiple Features
export DISABLED_FEATURES="ai-coding-assistant,github-integration"

# Method 3: Full Maintenance Mode
export MAINTENANCE_MODE=true
export EMERGENCY_MESSAGE="Platform maintenance in progress"
```

**Verification:**
```bash
# Check feature status
curl https://app.thiskidcancode.com/api/emergency-config

# Expected response when disabled:
{
  "disabledFeatures": ["ai-coding-assistant"],
  "maintenanceMode": false
}
```

### 📊 Gradual Rollout

**Scenario:** Testing new quest system with subset of users

```bash
# Enable for development environment only
export FEATURE_NEW_QUEST_FLOW=true  # In staging

# Production: Let age/progress gates control rollout
# 11+ year olds with 0+ quests will see it automatically
```

### 🔒 Age-Appropriate Controls

**COPPA Compliance (Under 13):**
- Only `coding-hints`, `new-quest-flow`, `gamification-v2` allowed
- All social features blocked
- No data collection features

**Parental Consent Required:**
- `peer-code-review`
- `community-challenges`
- `mentor-chat`

### 🎯 Feature Lifecycle

**1. Development Phase**
```bash
# Enable in development only
export FEATURE_NEW_FEATURE=true  # Local/staging
# Production: false (default)
```

**2. Beta Testing**
```bash
# Enable for advanced users (high quest count)
# Automatic via progress gates in code
```

**3. General Availability**
```bash
# Lower age/progress requirements in code
# Deploy updated gates
```

**4. Deprecation**
```bash
# Disable feature
export FEATURE_OLD_FEATURE=false
# Remove code in next release
```

## Monitoring & Alerts

### Key Metrics
- Feature adoption rates by age group
- Error rates per feature
- Performance impact of new features
- Student engagement with experimental features

### Alert Conditions
```bash
# High error rate in feature
if feature_error_rate > 5% then disable_feature()

# Performance degradation
if page_load_time > 3s then investigate_feature_impact()

# Student complaints
if support_tickets_about_feature > 10 then review_feature()
```

## Development Workflow

### Adding New Feature Flag

1. **Update Interface**
```typescript
// apprenticeship-platform/src/lib/feature-flags.ts
export interface FeatureFlags {
  'new-feature-name': boolean;
}
```

2. **Set Age/Progress Gates**
```typescript
const AGE_GATES: Record<keyof FeatureFlags, number> = {
  'new-feature-name': 14, // Minimum age
};

const PROGRESS_GATES: Record<keyof FeatureFlags, number> = {
  'new-feature-name': 20, // Minimum quests completed
};
```

3. **Use in Components**
```typescript
const flags = useFeatureFlags(user);

if (flags['new-feature-name']) {
  return <NewFeatureComponent />;
}
```

### Testing Feature Flags

```bash
# Local development - enable all features
export FEATURE_NEW_FEATURE=true
export FEATURE_EXPERIMENTAL_UI=true

# Staging - test with realistic constraints
# (Use actual age/progress gates)

# Production - gradual rollout
# (Start with high-progress users)
```

## Security Considerations

### Data Protection
- Features collecting student data require parental consent
- COPPA compliance for under-13 users
- FERPA compliance for educational records

### Access Control
- Social features require identity verification
- GitHub integration requires supervised setup
- Mentor chat requires background-checked mentors

### Emergency Procedures
- Instant disable capability for security issues
- Audit trail of all feature flag changes
- Rollback procedures for problematic features

## Troubleshooting

### Feature Not Appearing for Student

**Check List:**
1. **Age Gate:** Is student old enough?
2. **Progress Gate:** Has student completed required quests?
3. **Parental Consent:** Required for social features?
4. **Emergency Override:** Is feature disabled globally?
5. **Environment:** Check `NODE_ENV` and overrides

**Debug Commands:**
```typescript
// In browser console
const user = { age: 15, questsCompleted: 25, parentalConsent: true };
const flags = useFeatureFlags(user);
console.log(flags);

// Check next unlockable features
const next = getNextUnlockedFeatures(user);
console.log(next);
```

### Performance Issues

**Feature Impact Analysis:**
```bash
# Check feature usage metrics
# Identify heavy features
# Consider lazy loading or optimization
```

## Best Practices

### Educational Platform Specific
- **Progressive Disclosure:** Unlock features as students advance
- **Safety First:** Age-appropriate content and interactions
- **Parental Involvement:** Transparent about social features
- **Skill Building:** Features support learning progression

### Technical Best Practices
- **Fail Safe:** Default to disabled for new features
- **Cache Wisely:** 30-second cache for emergency config
- **Monitor Everything:** Track adoption and performance
- **Document Changes:** Clear changelog for educators

## Environment Variables Reference

```bash
# Individual Feature Overrides
FEATURE_CODING_HINTS=true|false
FEATURE_AI_CODING_ASSISTANT=true|false
FEATURE_GITHUB_INTEGRATION=true|false

# Bulk Controls
DISABLED_FEATURES="feature1,feature2,feature3"
MAINTENANCE_MODE=true|false
EMERGENCY_MESSAGE="Custom maintenance message"

# Environment
NODE_ENV=development|staging|production
```

## Analytics & Reporting 📊

### Student Engagement Metrics
- **Feature adoption by age group and quest level**
- **Time spent in each feature**
- **Educational outcome correlation**
- **Learning progression tracking**

### Safety Metrics  
- **Parental consent conversion rates**
- **Age-gate effectiveness (99.2% target)**
- **Social feature moderation stats**
- **COPPA compliance monitoring**

### Performance Monitoring
```bash
# Real-time feature performance
curl https://app.thiskidcancode.com/api/feature-metrics
{
  "ai-coding-assistant": {
    "activeUsers": 1250,
    "errorRate": 0.02,
    "avgResponseTime": "1.2s",
    "satisfactionScore": 4.7,
    "circuitBreakerState": "CLOSED",
    "ageGroupBreakdown": {
      "11-13": 320,
      "14-16": 680,
      "17-18": 250
    }
  }
}
```

### Dashboard Access
```bash
# View analytics dashboard
https://app.thiskidcancode.com/admin/feature-flags

# Key metrics monitored:
# - Real-time user adoption
# - Circuit breaker states
# - Age-appropriate usage patterns
# - Educational outcome correlation
```

### Educational Impact Tracking
- **Quest completion rates** with/without features
- **Code quality improvements** from peer review
- **GitHub skill development** progression
- **Student satisfaction scores** by feature

### Alert Thresholds
```bash
# Automated alerts for:
- Error rate > 5% → Emergency disable
- Satisfaction score < 4.0 → Review feature
- Circuit breaker OPEN → Investigate service
- Age-gate bypass attempts → Security review
```

## Contact & Escalation

**Feature Flag Issues:**
- **Development:** Check local environment variables
- **Staging:** Review deployment configuration  
- **Production:** Use emergency disable procedures

**Emergency Contacts:**
- Platform issues affecting students: Immediate disable
- Parental complaints: Review feature appropriateness
- Security concerns: Disable and investigate

---

*Remember: Our students' safety and learning experience comes first. When in doubt, disable the feature and investigate.* 🛡️