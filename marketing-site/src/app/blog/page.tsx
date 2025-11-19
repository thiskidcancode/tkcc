import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'This Kid Can Code Blog - Coding Tips and Education Resources',
  description: 'Read the latest articles about coding education, programming tips for kids, and updates from This Kid Can Code. Free resources for learning HTML, CSS, JavaScript, and GitHub.',
  keywords: ['this kid can code blog', 'coding tips for kids', 'programming education articles', 'free coding resources', 'HTML CSS JavaScript tutorials'],
};

export default function BlogPage() {
  const blogPosts = [
    {
      title: "Why This Kid Can Code Started in 2013",
      excerpt: "The story behind our mission to make coding education free and accessible to every child.",
      date: "2013-09-15",
      slug: "why-this-kid-can-code-started"
    },
    {
      title: "5 Reasons Kids Should Learn GitHub Early",
      excerpt: "Professional version control isn't just for adults. Here's why kids benefit from learning GitHub.",
      date: "2015-03-22", 
      slug: "kids-should-learn-github"
    },
    {
      title: "HTML for Beginners: Building Your First Web Page",
      excerpt: "A step-by-step guide to creating your first HTML page with This Kid Can Code.",
      date: "2014-11-08",
      slug: "html-for-beginners"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-green-500">
      <div className="container mx-auto px-4 py-16">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
            This Kid Can Code Blog
          </h1>
          
          <p className="text-xl text-gray-600 text-center mb-12">
            Coding tips, education resources, and updates from our free programming platform
          </p>

          <div className="space-y-8">
            {blogPosts.map((post) => (
              <article key={post.slug} className="border-b border-gray-200 pb-8 last:border-b-0">
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-3">{post.excerpt}</p>
                <div className="flex justify-between items-center">
                  <time className="text-sm text-gray-500">{post.date}</time>
                  <span className="text-gray-400 font-medium">
                    Archived
                  </span>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              Want to stay updated with the latest coding tips and This Kid Can Code news?
            </p>
            <a 
              href="/?waitlist=true"
              className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:scale-105 transition-transform duration-200 inline-block"
            >
              Join Our Waitlist
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}