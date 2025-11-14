"use client";
import { useState, useEffect } from "react";
import {
  ChevronRight,
  Star,
  Rocket,
  Trophy,
  Heart,
  Users,
  Calendar,
  Gift,
} from "lucide-react";
import Image from "next/image";
import { useStripe } from "../hooks/useStripe";

export default function Home() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Free Coding Education for Kids',
    description: 'Learn HTML, CSS, and JavaScript through gamified adventures',
    provider: {
      '@type': 'EducationalOrganization',
      name: 'ThisKidCanCode',
    },
    educationalLevel: 'Beginner to Intermediate',
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student',
      audienceType: 'children ages 11-18',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  useEffect(() => {
    // Trigger confetti animation on load
    setTimeout(() => setShowConfetti(true), 1000);
    setTimeout(() => setShowConfetti(false), 6000);
  }, []);

  const { createCheckoutSession } = useStripe();

  const handleDonation = (amount: number) => {
    createCheckoutSession(amount, 'donation');
  };

  const handleSubscription = () => {
    createCheckoutSession(25, 'subscription');
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter/SMS signup placeholder
    console.log("Newsletter signup:", { email, phone });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-green-500 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
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

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            >
              🎉
            </div>
          ))}
        </div>
      )}

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center" role="banner">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
          <div className="mb-8">
            <Image
              src="/tkccFbLogo.png"
              alt="ThisKidCanCode Logo"
              className="mx-auto h-30 w-auto mb-6 rounded-2xl"
              width={0}
              height={0}
            />
          </div>

          <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 animate-pulse">
            🚀 Empowering Future Coders Since 2013! 🚀
          </h1>

          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto">
            100% FREE coding adventures that transform kids into
            <span className="text-yellow-300 font-bold"> REAL PROGRAMMERS</span>
            !
          </p>

          {/* Impact Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-4xl mb-2">👥</div>
              <div className="text-3xl font-bold text-white">5,000+</div>
              <div className="text-white/80">Future Coders Trained</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-4xl mb-2">📅</div>
              <div className="text-3xl font-bold text-white">11+</div>
              <div className="text-white/80">Years of Adventures</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-4xl mb-2">💯</div>
              <div className="text-3xl font-bold text-white">100%</div>
              <div className="text-white/80">Always FREE</div>
            </div>
          </div>

          <button className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-12 py-4 rounded-lg text-xl font-bold hover:scale-105 transition-transform duration-200 shadow-lg">
            🎮 Start Your Coding Adventure!
          </button>
        </section>

        {/* Mission Section */}
        <section className="bg-white/95 backdrop-blur-sm py-16" role="main" aria-labelledby="mission-heading">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 id="mission-heading" className="text-4xl font-bold text-gray-800 mb-4">
                🎯 Our Coding Mission
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We guide kids from zero to hero using gamified adventures,
                professional tools, and superhero-themed learning!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6">
                <div className="text-5xl mb-4 text-gray-800">🕵️♀️</div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">
                  Device Detective
                </h3>
                <p className="text-gray-600">
                  Works on any device - phone, laptop, or Chromebook!
                </p>
              </div>
              <div className="text-center p-6">
                <div className="text-5xl mb-4 text-gray-800">🦸♂️</div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">
                  GitHub Superhero
                </h3>
                <p className="text-gray-600">
                  Real professional tools used by actual programmers
                </p>
              </div>
              <div className="text-center p-6">
                <div className="text-5xl mb-4 text-gray-800">🚀</div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">
                  Coding Spaceship
                </h3>
                <p className="text-gray-600">
                  Cloud-based development environment
                </p>
              </div>
              <div className="text-center p-6">
                <div className="text-5xl mb-4 text-gray-800">🏆</div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">
                  Victory Celebration
                </h3>
                <p className="text-gray-600">
                  Build real projects that actually work!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section className="py-16" aria-labelledby="support-heading">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 id="support-heading" className="text-4xl font-bold text-white mb-4">
                💝 Support Our Mission
              </h2>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Help us keep coding adventures FREE for every kid! Your support
                powers the next generation of programmers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                {
                  amount: 50,
                  title: "Code Cadet",
                  description: "Sponsors 1 student for a month",
                },
                {
                  amount: 100,
                  title: "Programming Hero",
                  description: "Sponsors 2 students for a month",
                },
                {
                  amount: 500,
                  title: "Coding Champion",
                  description: "Sponsors 10 students for a month",
                },
              ].map((tier) => (
                <div
                  key={tier.amount}
                  className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-200"
                >
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {tier.title}
                  </h3>
                  <div className="text-3xl font-bold text-purple-600 mb-4">
                    ${tier.amount}
                  </div>
                  <p className="text-gray-600 mb-6">{tier.description}</p>
                  <button
                    onClick={() => handleDonation(tier.amount)}
                    className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:scale-105 transition-transform duration-200 w-full"
                  >
                    Donate ${tier.amount}
                  </button>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <button 
                onClick={handleSubscription}
                className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-8 py-3 rounded-lg font-bold hover:scale-105 transition-transform duration-200"
              >
                💳 Monthly Subscription ($25/month)
              </button>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="bg-white/95 backdrop-blur-sm py-16" aria-labelledby="newsletter-heading">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="text-center mb-8">
              <h2 id="newsletter-heading" className="text-4xl font-bold text-gray-800 mb-4">
                📱 Join the Coding Heroes Community!
              </h2>
              <p className="text-xl text-gray-600">
                Get coding tips, success stories, and adventure updates!
              </p>
            </div>

            <form onSubmit={handleNewsletter} className="space-y-4" aria-label="Newsletter signup form">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full p-4 border border-gray-300 rounded-lg text-lg"
                  required
                  aria-label="Email address"
                />
              </div>
              <div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number (optional SMS updates)"
                  className="w-full p-4 border border-gray-300 rounded-lg text-lg"
                  aria-label="Phone number (optional)"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-lg text-xl font-bold hover:scale-105 transition-transform duration-200"
              >
                🚀 Join the Adventure!
              </button>
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 text-center text-white/80" role="contentinfo">
          <div className="container mx-auto px-4">
            <p className="mb-4">
              © 2024 ThisKidCanCode - Empowering Future Coders Since 2013
            </p>
            <div className="space-x-6">
              <a href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a
                href="mailto:hello@thiskidcancode.com"
                className="hover:text-white transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
