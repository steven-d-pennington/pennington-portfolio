export default function CaseStudies() {
  const caseStudies = [
    {
      id: 'emar-migration',
      title: 'From Legacy to Leader: A Cloud Native Transformation Journey in the EMAR Market',
      excerpt: 'How a SaaS provider specializing in Electronic Medication Administration Record (EMAR) systems successfully transformed from traditional on-premises architecture to a modern cloud-native platform, capturing over 10% market share.',
      category: 'Cloud Migration & Modernization',
      industry: 'Healthcare Technology',
      results: [
        'Achieved over 10% market share in competitive EMAR space',
        'Reduced deployment time from monthly to weekly cycles',
        'Improved system reliability from 95% to 99.9% uptime',
        'Reduced support response times by 70%'
      ],
      technologies: ['AWS', 'Kubernetes', 'Docker', 'Microservices', 'HIPAA Compliance'],
      featured: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Case Studies
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real-world examples of how we&apos;ve helped organizations transform their technology 
              infrastructure and achieve remarkable business outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Case Study */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Case Study
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover how strategic cloud migration can transform traditional software companies into industry leaders.
            </p>
          </div>
          
          {caseStudies.filter(cs => cs.featured).map((caseStudy) => (
            <div key={caseStudy.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center mb-4">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {caseStudy.category}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">• {caseStudy.industry}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {caseStudy.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {caseStudy.excerpt}
                  </p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Key Results:</h4>
                    <ul className="space-y-2">
                      {caseStudy.results.map((result, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">{result}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Technologies Used:</h4>
                    <div className="flex flex-wrap gap-2">
                      {caseStudy.technologies.map((tech, index) => (
                        <span key={index} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <a 
                    href={`/case-studies/${caseStudy.id}`}
                    className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Read Full Case Study
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-4">Executive Summary</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    This case study examines how a SaaS provider specializing in Electronic Medication Administration Record (EMAR) systems for assisted living communities successfully transformed from a traditional on-premises monolithic architecture to a modern cloud-native platform. This strategic migration enabled the company to capture over 10% market share and establish itself as an industry leader, demonstrating the transformative power of cloud adoption in the healthcare technology sector.
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Market Share:</span>
                        <div className="font-semibold text-green-600">10%+</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Uptime Improvement:</span>
                        <div className="font-semibold text-green-600">95% → 99.9%</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Deployment Speed:</span>
                        <div className="font-semibold text-green-600">Monthly → Weekly</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Support Efficiency:</span>
                        <div className="font-semibold text-green-600">70% Faster</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* All Case Studies Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              All Case Studies
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our complete portfolio of successful transformations and implementations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.map((caseStudy) => (
              <div key={caseStudy.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {caseStudy.category}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">• {caseStudy.industry}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {caseStudy.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {caseStudy.excerpt}
                  </p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">Key Results:</h4>
                    <ul className="space-y-1">
                      {caseStudy.results.slice(0, 2).map((result, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span className="text-xs text-gray-700">{result}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <a 
                    href={`/case-studies/${caseStudy.id}`}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm inline-flex items-center"
                  >
                    Read Full Case Study
                    <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Let&apos;s discuss how we can help you achieve similar results with your technology transformation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started Today
            </a>
            <a 
              href="/services" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              View Our Services
            </a>
          </div>
        </div>
      </section>
    </div>
  );
} 