# ThisKidCanCode Marketing Site 🚀

Adventure-themed marketing site for ThisKidCanCode - empowering future coders since 2013!

## Features

- 🎮 Adventure-themed design matching the apprenticeship platform
- 📊 Impact stats (5,000+ students served since 2013)
- 💳 Stripe integration for donations ($50, $100, $500 tiers)
- 📱 Newsletter and SMS signup via Twilio
- 🛡️ Privacy Policy and Terms of Service for compliance
- ⭐ Animated backgrounds and confetti effects

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm run dev

# Build for production
pnpm run build

# Deploy to S3
./deploy.sh
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

- `STRIPE_PUBLISHABLE_KEY` - Stripe public key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `TWILIO_ACCOUNT_SID` - Twilio account SID
- `TWILIO_AUTH_TOKEN` - Twilio auth token
- `TWILIO_PHONE_NUMBER` - Twilio phone number

## Deployment

The site is configured for static export to S3:

1. Build creates static files in `out/` directory
2. `deploy.sh` syncs to S3 bucket using `tkcc` AWS profile
3. CloudFront serves the static site

## Logo

The site references the existing TKCC logo from:
`https://thiskidcancode.s3.amazonaws.com/images/tkcc-logo.png`

## Architecture

- **Next.js 16** with static export
- **Tailwind CSS** for styling
- **Stripe** for payment processing
- **Twilio** for SMS (future integration)
- **AWS S3 + CloudFront** for hosting# Trigger staging deployment with updated environment variables
