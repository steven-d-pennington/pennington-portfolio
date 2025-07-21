import Link from 'next/link';

export default function TechnologiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Technologies & Stacks
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore the diverse range of technologies and cloud platforms we leverage to build robust, scalable, and innovative solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Technology Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Cloud Provider Stacks Card */}
            <Link href="/technologies/cloud-providers" className="block">
              <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-8 h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Cloud Provider Stacks</h2>
                  <p className="text-gray-600 mb-6">
                    Deep expertise across leading cloud platforms like AWS, Google Cloud, Vercel, and more, focusing on scalable infrastructure and managed services.
                  </p>
                </div>
                <div className="text-blue-600 font-semibold flex items-center">
                  Learn More
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Software Development Stacks Card */}
            <Link href="/technologies/software-development" className="block">
              <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-8 h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Software Development Stacks</h2>
                  <p className="text-gray-600 mb-6">
                    Proficiency in modern programming languages, frameworks, databases, and development methodologies for building robust applications.
                  </p>
                </div>
                <div className="text-blue-600 font-semibold flex items-center">
                  Learn More
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Build Your Next Big Idea?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Let&apos;s discuss how our technical expertise can bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started Today
            </Link>
            <Link 
              href="/case-studies" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              View Our Case Studies
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
