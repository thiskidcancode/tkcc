import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About This Kid Can Code - Free Coding Education Since 2013',
  description: 'Learn about This Kid Can Code&apos;s mission to provide 100% free coding education to kids ages 11-18. Over 5,000 students trained in HTML, CSS, JavaScript, and professional GitHub workflows.',
  keywords: ['this kid can code about', 'free coding education history', 'coding for kids mission', 'programming education nonprofit'],
  openGraph: {
    title: 'About This Kid Can Code - Free Coding Education Since 2013',
    description: 'Learn about This Kid Can Code&apos;s mission to provide 100% free coding education to kids ages 11-18.',
  },
};

export default function AboutPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "mainEntity": {
      "@type": "EducationalOrganization",
      "name": "This Kid Can Code",
      "foundingDate": "2013",
      "description": "Free coding education platform for kids ages 11-18",
      "mission": "Empowering every student with professional-grade computer science education"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-green-500">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="container mx-auto px-4 py-16">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
            About This Kid Can Code
          </h1>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              Since 2013, This Kid Can Code has been on a mission to democratize computer science education. 
              We believe every child, regardless of their background or financial situation, deserves access 
              to high-quality programming education that prepares them for the digital future.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">What Makes Us Different</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-2 text-gray-800">100% Free Forever</h3>
                <p className="text-gray-600">No hidden costs, no premium tiers. Quality coding education should never be behind a paywall.</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-2 text-gray-800">Real Professional Tools</h3>
                <p className="text-gray-600">Students learn using GitHub, the same platform used by professional developers worldwide.</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-2 text-gray-800">Gamified Learning</h3>
                <p className="text-gray-600">Superhero-themed adventures make learning HTML, CSS, and JavaScript engaging and fun.</p>
              </div>
              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-2 text-gray-800">Community Impact</h3>
                <p className="text-gray-600">Students build real projects that help local organizations and make a difference.</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Impact</h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-purple-600">5,000+</div>
                  <div className="text-gray-600">Students Trained</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">11+</div>
                  <div className="text-gray-600">Years of Experience</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">100%</div>
                  <div className="text-gray-600">Free Education</div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Curriculum</h2>
            <p className="text-gray-600 mb-4">
              This Kid Can Code offers a comprehensive curriculum designed for kids ages 11-18:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
              <li><strong>HTML Foundations:</strong> Learn the building blocks of web pages</li>
              <li><strong>CSS Styling:</strong> Make websites beautiful and responsive</li>
              <li><strong>JavaScript Programming:</strong> Add interactivity and dynamic features</li>
              <li><strong>GitHub Workflows:</strong> Professional version control and collaboration</li>
              <li><strong>Real-World Projects:</strong> Build applications that solve actual problems</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Choose This Kid Can Code?</h2>
            <p className="text-gray-600 mb-4">
              In a world where coding bootcamps can cost thousands of dollars, This Kid Can Code stands 
              as a beacon of accessible education. We&apos;ve proven that high-quality programming education 
              doesn&apos;t need to be expensive to be effective.
            </p>
            <p className="text-gray-600 mb-6">
              Our students don&apos;t just learn to code – they learn to think like programmers, solve complex 
              problems, and use the same professional tools that power the world&apos;s biggest tech companies.
            </p>

            <div className="text-center">
              <Link 
                href="/"
                className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:scale-105 transition-transform duration-200 inline-block"
              >
                Start Your Coding Journey Today
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}