import Link from 'next/link';

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Portfolio</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our work, technologies, and client success stories. 
            Discover how we&apos;ve helped businesses transform their digital presence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link 
            href="/case-studies" 
            className="group bg-blue-50 rounded-lg p-6 hover:bg-blue-100 transition-colors"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600">
              Case Studies
            </h2>
            <p className="text-gray-600">
              Detailed showcases of our most impactful projects and the results we achieved.
            </p>
          </Link>

          <Link 
            href="/technologies" 
            className="group bg-green-50 rounded-lg p-6 hover:bg-green-100 transition-colors"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-green-600">
              Technologies
            </h2>
            <p className="text-gray-600">
              The modern tech stack and tools we use to build scalable solutions.
            </p>
          </Link>

          <Link 
            href="/success-stories" 
            className="group bg-purple-50 rounded-lg p-6 hover:bg-purple-100 transition-colors"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-purple-600">
              Success Stories
            </h2>
            <p className="text-gray-600">
              Real results and transformations achieved through our partnerships.
            </p>
          </Link>

          <Link 
            href="/testimonials" 
            className="group bg-orange-50 rounded-lg p-6 hover:bg-orange-100 transition-colors"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-orange-600">
              Client Testimonials
            </h2>
            <p className="text-gray-600">
              What our clients say about working with Monkey LoveStack.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}