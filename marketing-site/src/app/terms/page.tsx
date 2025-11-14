import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'ThisKidCanCode terms of service - guidelines for using our free coding education platform for kids ages 11-18.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function Terms() {
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
              📜 Terms of Service
            </h1>
            <p className="text-lg text-gray-600">
              The rules of our coding adventure
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🎮 Welcome to the Adventure!</h2>
            <p className="mb-6">
              By using ThisKidCanCode, you agree to these terms. We've made them as simple as possible 
              because we believe in transparency and fairness for our coding heroes and their families.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">🆓 Our Free Promise</h2>
            <ul className="mb-6 space-y-2">
              <li>ThisKidCanCode is 100% free for all students</li>
              <li>No hidden fees, subscriptions, or premium tiers</li>
              <li>All coding adventures and resources are freely available</li>
              <li>Donations are voluntary and help us serve more students</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">👨👩👧👦 Age and Parental Consent</h2>
            <ul className="mb-6 space-y-2">
              <li>Our platform is designed for ages 11-18</li>
              <li>Students under 13 require parental consent</li>
              <li>Parents are encouraged to participate in the coding journey</li>
              <li>We comply with COPPA and other child protection laws</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">🤝 Community Guidelines</h2>
            <ul className="mb-6 space-y-2">
              <li>Be respectful to fellow coders and mentors</li>
              <li>Use appropriate language in all communications</li>
              <li>Help others learn and grow</li>
              <li>Report any inappropriate behavior to our team</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">💳 Donations and Payments</h2>
            <ul className="mb-6 space-y-2">
              <li>All donations are processed securely through Stripe</li>
              <li>Donations are non-refundable but tax-deductible</li>
              <li>Monthly subscriptions can be cancelled anytime</li>
              <li>100% of donations support our free educational mission</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">📱 Communications</h2>
            <ul className="mb-6 space-y-2">
              <li>Email newsletters are opt-in and can be unsubscribed anytime</li>
              <li>SMS updates via Twilio require explicit consent</li>
              <li>We never spam or share contact information</li>
              <li>All communications are educational and supportive</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">🔧 Platform Usage</h2>
            <ul className="mb-6 space-y-2">
              <li>Use our platform for educational purposes only</li>
              <li>Don't attempt to hack, disrupt, or misuse our services</li>
              <li>Respect intellectual property and licensing</li>
              <li>Report bugs and issues to help us improve</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">📞 Contact Us</h2>
            <p className="mb-6">
              Questions about our terms? Contact us at{" "}
              <a href="mailto:legal@thiskidcancode.com" className="text-blue-600 hover:underline">
                legal@thiskidcancode.com
              </a>
            </p>

            <div className="bg-green-50 border border-green-300 rounded-lg p-6 mt-8">
              <p className="text-green-800 font-semibold">
                📜 Last updated: January 2024
              </p>
              <p className="text-green-700 mt-2">
                We may update these terms as we grow and improve. 
                We'll notify users of any significant changes.
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <a 
              href="/"
              className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:scale-105 transition-transform duration-200"
            >
              🚀 Back to Adventure!
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}