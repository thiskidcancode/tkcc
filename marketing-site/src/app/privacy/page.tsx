import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'ThisKidCanCode privacy policy - how we protect student data and maintain FERPA compliance in our free coding education platform.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-green-500 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              fontSize: `${Math.random() * 20 + 10}px`,
            }}
          >
            ⭐
          </div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              🛡️ Privacy Policy
            </h1>
            <p className="text-lg text-gray-600">
              Protecting our young coders and their families
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🎯 Our Mission</h2>
            <p className="mb-6">
              ThisKidCanCode is committed to protecting the privacy and safety of children and families. 
              We collect only the minimum information necessary to provide our free coding education platform.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">📱 Information We Collect</h2>
            <ul className="mb-6 space-y-2">
              <li><strong>Email addresses:</strong> For newsletter updates and platform communications</li>
              <li><strong>Phone numbers:</strong> Optional, for SMS updates via Twilio (with explicit consent)</li>
              <li><strong>Usage data:</strong> Anonymous analytics to improve our platform</li>
              <li><strong>Payment information:</strong> Processed securely through Stripe for donations</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">🔒 How We Protect Your Data</h2>
            <ul className="mb-6 space-y-2">
              <li>All data is encrypted in transit and at rest</li>
              <li>We never sell or share personal information with third parties</li>
              <li>Payment processing is handled securely by Stripe</li>
              <li>SMS services are provided by Twilio with industry-standard security</li>
              <li>We comply with COPPA (Children&apos;s Online Privacy Protection Act)</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">👨👩👧👦 Parental Rights</h2>
            <ul className="mb-6 space-y-2">
              <li>Parents can request deletion of their child&apos;s data at any time</li>
              <li>Parents can opt their child out of all communications</li>
              <li>We encourage parental involvement in the coding journey</li>
              <li>No personal information is required to use our free platform</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">📞 Contact Us</h2>
            <p className="mb-6">
              Questions about privacy? Contact us at{" "}
              <a href="mailto:privacy@thiskidcancode.com" className="text-blue-600 hover:underline">
                privacy@thiskidcancode.com
              </a>
            </p>

            <div className="bg-blue-50 border border-blue-300 rounded-lg p-6 mt-8">
              <p className="text-blue-800 font-semibold">
                🛡️ Last updated: January 2024
              </p>
              <p className="text-blue-700 mt-2">
                We may update this policy as we improve our platform. 
                We&apos;ll notify users of any significant changes.
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link 
              href="/"
              className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:scale-105 transition-transform duration-200"
            >
              🚀 Back to Adventure!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}