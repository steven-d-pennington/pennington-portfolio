export default function OEDModernizationCaseStudy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-4xl">
            <div className="flex items-center mb-6">
              <span className="bg-purple-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                API Integration & Legacy Modernization
              </span>
              <span className="ml-3 text-purple-100">• Government Technology</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              From Days to Seconds: How Modern APIs Revolutionized a Legacy System
            </h1>
            <p className="text-xl text-purple-100 mb-8">
              How a state employment agency dramatically reduced unemployment claims processing time from days to seconds by strategically integrating modern APIs with their decades-old COBOL system.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold">99%</div>
                <div className="text-sm text-purple-100">Reduction in Processing Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">Seconds</div>
                <div className="text-sm text-purple-100">New Processing Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">Days</div>
                <div className="text-sm text-purple-100">Old Processing Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">High</div>
                <div className="text-sm text-purple-100">ROI</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex flex-wrap gap-4 text-sm">
            <a href="#challenge" className="text-purple-600 hover:text-purple-700">The Challenge</a>
            <a href="#solution" className="text-gray-600 hover:text-gray-900">The Solution</a>
            <a href="#results" className="text-gray-600 hover:text-gray-900">The Results</a>
            <a href="#takeaways" className="text-gray-600 hover:text-gray-900">Key Takeaways</a>
          </nav>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* The Challenge */}
        <section id="challenge" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Challenge: A System Trapped in Time</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed">
              A state employment agency was struggling with a critical bottleneck in its unemployment claims processing. Their core system, built on decades-old COBOL code, relied on archaic looping operations that caused significant delays. Processing each claim took <strong>2 to 3 days</strong>, leading to a huge backlog, frustrated citizens, and a massive strain on staff. The agency needed a way to dramatically improve efficiency without a complete and costly system overhaul.
            </p>
          </div>
        </section>

        {/* The Solution */}
        <section id="solution" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Solution: A Strategic Modernization</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed">
              Our mission was to find a targeted, high-impact solution that could coexist with the legacy architecture. We identified a key opportunity to bypass the slow, internal processing by using modern, external APIs. My approach was to build an intermediary layer using <strong>ColdFusion</strong> that could:
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
              <li>Pull data from the old system.</li>
              <li>Process the information by leveraging powerful new APIs.</li>
              <li>Push the results back into the legacy system, completing the claims processing cycle.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              This strategy allowed the agency to modernize a critical business function without the risk and expense of a full system rewrite.
            </p>
          </div>
        </section>

        {/* The Results */}
        <section id="results" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Results: A New Standard of Speed</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed">
              The impact was immediate and transformative. By re-routing the claims through the new API-driven process, the processing time was slashed from <strong>2-3 days down to mere seconds</strong>.
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
              <li><strong>99% Reduction in Processing Time:</strong> Claims that once took days to complete were processed in a fraction of a minute.</li>
              <li><strong>Improved Citizen Service:</strong> The agency could provide faster service to those in need, reducing wait times and improving public perception.</li>
              <li><strong>Increased Operational Efficiency:</strong> Staff could focus on more complex tasks, as the automated process handled the bulk of the workload.</li>
            </ul>
          </div>
        </section>

        {/* Key Takeaways */}
        <section id="takeaways" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Takeaways</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed">
              This project demonstrated that complex, long-standing problems in legacy systems can be solved with <strong>innovative thinking and targeted integration</strong>. It’s not always about tearing down the old; sometimes, it’s about strategically building new layers that enable old systems to perform in a modern world. This approach delivers a fast return on investment and minimizes risk.
            </p>
          </div>
        </section>
      </div>

      {/* CTA Section */}
      <section className="bg-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl mb-8 text-purple-100 max-w-2xl mx-auto">
            Let&apos;s discuss how we can help you achieve similar results with your technology transformation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started Today
            </a>
            <a 
              href="/case-studies" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
            >
              View All Case Studies
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
