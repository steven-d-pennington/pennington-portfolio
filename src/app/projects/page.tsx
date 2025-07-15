export default function Projects() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Our Projects
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Showcasing our expertise in full-stack development, cloud migrations, and application modernization. 
              From concept to deployment, we bring ideas to life on the web.
            </p>
          </div>
        </div>
      </section>

      {/* Infrastructure Case Study Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Featured Case Study: Cloud Migration & Modernization
              </h2>
              
              {/* Placeholder for Infrastructure Diagram */}
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center mb-6">
                <div className="text-center">
                  <div className="text-6xl text-gray-400 mb-4">🏗️</div>
                  <p className="text-gray-500 text-lg">Infrastructure Diagram Placeholder</p>
                  <p className="text-gray-400 text-sm">Architecture overview and migration flow</p>
                </div>
              </div>
              
              {/* Case Study Summary */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Enterprise Monolith to Microservices Migration
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Complete modernization of a legacy monolithic application serving 100,000+ users. 
                  Our team successfully migrated the entire infrastructure to AWS, breaking down the monolith 
                  into scalable microservices while maintaining zero downtime during the transition.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900">Challenge</h4>
                    <p className="text-blue-700 text-sm mt-1">Legacy monolith with scalability issues</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900">Solution</h4>
                    <p className="text-green-700 text-sm mt-1">Microservices architecture on AWS</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-900">Result</h4>
                    <p className="text-purple-700 text-sm mt-1">99.9% uptime, 60% cost reduction</p>
                  </div>
                </div>
                <div className="pt-4">
                  <a 
                    href="#" 
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    Read Full Case Study
                    <svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Showcase Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Featured Applications
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Modern web applications built with cutting-edge technologies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Application 1 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
              {/* Screenshot Placeholder */}
              <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-4xl mb-2">📱</div>
                  <p className="text-sm opacity-90">Application Screenshot</p>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  E-Commerce Platform
                </h3>
                <p className="text-gray-600 mb-4">
                  Full-stack e-commerce solution with real-time inventory management, 
                  payment processing, and advanced analytics dashboard.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Next.js</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Node.js</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">PostgreSQL</span>
                </div>
                <div className="flex space-x-3">
                  <a 
                    href="#" 
                    className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    View Live Site
                  </a>
                  <a 
                    href="#" 
                    className="flex-1 text-center px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-sm"
                  >
                    View on GitHub
                  </a>
                </div>
              </div>
            </div>

            {/* Application 2 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
              {/* Screenshot Placeholder */}
              <div className="w-full h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-4xl mb-2">🔍</div>
                  <p className="text-sm opacity-90">Application Screenshot</p>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Data Analytics Dashboard
                </h3>
                <p className="text-gray-600 mb-4">
                  Real-time data visualization platform with custom reporting, 
                  automated insights, and multi-tenant architecture.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">React</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Python</span>
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Redis</span>
                </div>
                <div className="flex space-x-3">
                  <a 
                    href="#" 
                    className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    View Live Site
                  </a>
                  <a 
                    href="#" 
                    className="flex-1 text-center px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-sm"
                  >
                    View on GitHub
                  </a>
                </div>
              </div>
            </div>

            {/* Application 3 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
              {/* Screenshot Placeholder */}
              <div className="w-full h-48 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-4xl mb-2">⚡</div>
                  <p className="text-sm opacity-90">Application Screenshot</p>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Serverless API Gateway
                </h3>
                <p className="text-gray-600 mb-4">
                  High-performance API gateway with auto-scaling, rate limiting, 
                  and comprehensive monitoring for microservices architecture.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">AWS Lambda</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">TypeScript</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">DynamoDB</span>
                </div>
                <div className="flex space-x-3">
                  <a 
                    href="#" 
                    className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    View Live Site
                  </a>
                  <a 
                    href="#" 
                    className="flex-1 text-center px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-sm"
                  >
                    View on GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to bring your ideas to life?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Let&apos;s discuss how we can help modernize your applications and infrastructure.
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-50 transition-colors"
          >
            Start Your Project
          </a>
        </div>
      </section>
    </div>
  );
}
