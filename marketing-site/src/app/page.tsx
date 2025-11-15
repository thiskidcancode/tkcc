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
  const [mounted, setMounted] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

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
    setMounted(true);
    // Trigger confetti animation on load
    setTimeout(() => setShowConfetti(true), 1000);
    setTimeout(() => setShowConfetti(false), 6000);
  }, []);

  const { createCheckoutSession } = useStripe();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-green-500 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {mounted && [...Array(30)].map((_, i) => (
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
      {mounted && showConfetti && (
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
            🚀 Empowering Future Coders Since 2013! 🌟
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

          <button 
            onClick={() => setShowComingSoon(true)}
            className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-12 py-4 rounded-lg text-xl font-bold hover:scale-105 transition-transform duration-200 shadow-lg"
          >
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
                powers the next generation of programmers. 🚀
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
                    ${tier.amount}/month
                  </div>
                  <p className="text-gray-600 mb-6">{tier.description}</p>
                  <button
                    onClick={() => createCheckoutSession(tier.amount, 'subscription')}
                    className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:scale-105 transition-transform duration-200 w-full"
                  >
                    Subscribe ${tier.amount}/month
                  </button>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
                <div className="text-4xl mb-4">💝</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">One-Time Donation</h3>
                <p className="text-gray-600 mb-6">Choose your own amount to support our mission</p>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[25, 50, 100].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => createCheckoutSession(amount, 'donation')}
                      className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-4 py-2 rounded-lg font-bold hover:scale-105 transition-transform duration-200"
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    const amount = prompt('Enter donation amount:');
                    if (amount && !isNaN(Number(amount)) && Number(amount) > 0) {
                      createCheckoutSession(Number(amount), 'donation');
                    }
                  }}
                  className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-2 rounded-lg font-bold hover:scale-105 transition-transform duration-200 w-full"
                >
                  💳 Custom Amount
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Coming Soon Modal */}
        {showComingSoon && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Coming Soon!</h3>
              <p className="text-gray-600 mb-6">
                Our coding adventure platform is launching soon! Get ready for an amazing journey into programming.
              </p>
              <button
                onClick={() => setShowComingSoon(false)}
                className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:scale-105 transition-transform duration-200"
              >
                Got it!
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="py-8 text-center text-white/80" role="contentinfo">
          <div className="container mx-auto px-4">
            <p className="mb-4">
              © 2025 ThisKidCanCode - Empowering Future Coders Since 2013
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
