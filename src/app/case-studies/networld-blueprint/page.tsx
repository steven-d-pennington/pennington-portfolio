export default function NetworldBlueprintCaseStudy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-4xl">
            <div className="flex items-center mb-6">
              <span className="bg-green-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                Internet Infrastructure & Product Development
              </span>
              <span className="ml-3 text-green-100">• Startup & Disruption</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              The Innovator&apos;s Blueprint: Building a Disruption Engine from Scratch
            </h1>
            <p className="text-xl text-green-100 mb-8">
              How a small, agile team disrupted the internet service provider market by offering unheard-of affordability and pioneering city-wide wireless technology.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold">$79/year</div>
                <div className="text-sm text-green-100">Unlimited Dial-up</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">1st</div>
                <div className="text-sm text-green-100">City-wide Wireless Network</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">3 Years</div>
                <div className="text-sm text-green-100">Time to Top 10 Growth</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">7th</div>
                <div className="text-sm text-green-100">Fastest Growing Company</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex flex-wrap gap-4 text-sm">
            <a href="#idea-challenge" className="text-green-600 hover:text-green-700">The Idea & The Challenge</a>
            <a href="#strategy" className="text-gray-600 hover:text-gray-900">The Breakthrough Strategy</a>
            <a href="#technical-innovation" className="text-gray-600 hover:text-gray-900">The Technical Innovation</a>
            <a href="#product-ecosystem" className="text-gray-600 hover:text-gray-900">The Product Ecosystem</a>
            <a href="#result" className="text-gray-600 hover:text-gray-900">The Result</a>
          </nav>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* The Idea & The Challenge */}
        <section id="idea-challenge" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Idea & The Challenge: A Market Crying for Change</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed">
              In the late 1990s, the internet was a luxury. Getting online meant paying for an expensive dial-up connection from providers like AOL, and high-speed access was an unreachable dream for most, requiring costly T1 lines. The market was ripe for a disruption.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Our company was founded on a simple premise: to make the internet accessible and affordable for everyone. We set out to challenge the giants and prove that a small, agile team could create a better way to connect.
            </p>
          </div>
        </section>

        {/* The Breakthrough Strategy */}
        <section id="strategy" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Breakthrough Strategy: Unheard-of Affordability</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed">
              Our first strategic move was to offer an incredible price point: a flat fee of just <strong>$79 per year</strong> for unlimited dial-up internet. This was a completely unheard-of price at the time and proved to be a powerful disruptor. We didn&apos;t need a massive marketing budget; our value spoke for itself. We grew quickly through the most effective channels available: <strong>word-of-mouth referrals</strong> and local newspaper advertisements.
            </p>
          </div>
        </section>

        {/* The Technical Innovation */}
        <section id="technical-innovation" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Technical Innovation: Pioneering a New Wireless Frontier</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed">
              As high-speed cable was still a distant reality, we saw a new opportunity to bring high-speed internet to our customers. We were among the first to experiment with the then-nascent <strong>2.4 GHz wireless technology</strong> from companies like Cisco. Our team successfully engineered and built <strong>the very first city-wide wireless network in a major metro area</strong>, enabling us to offer high-speed internet access that was previously out of reach for most homes and businesses. We soon expanded our wireless network to nearby communities.
            </p>
          </div>
        </section>

        {/* The Product Ecosystem */}
        <section id="product-ecosystem" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Product Ecosystem: A Full Stack of Innovation</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed">
              In addition to building the network infrastructure, we operated with a full-stack mentality, creating an entire ecosystem of products in-house. This allowed us to control every aspect of the user experience and innovate at a rapid pace.
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
              <li><strong>In-House Systems:</strong> We built our own custom billing, authentication, and monitoring systems from the ground up, giving us complete control and flexibility.</li>
              <li><strong>ISP-in-a-Box:</strong> We productized our internal systems into a package we called <strong>ISP-in-a-Box</strong>, a complete toolkit for anyone looking to start their own internet service provider.</li>
              <li><strong>Web Services Suite:</strong> We were early innovators in web-based services, creating:
                <ul className="list-circle list-inside ml-4 space-y-1">
                  <li>One of the first web-based email clients.</li>
                  <li>An in-house search engine.</li>
                  <li>A customizable news feed portal.</li>
                  <li>A software repository and a stock tracking site.</li>
                  <li>Web development servers and a pioneering <strong>WYSIWYG site editor</strong>.</li>
                </ul>
              </li>
            </ul>
          </div>
        </section>

        {/* The Result */}
        <section id="result" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Result: A Story of Rapid Growth</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed">
              Our relentless focus on innovation, affordability, and the customer experience paid off. Within just <strong>three years</strong>, our company was recognized as the <strong>7th fastest-growing company</strong> in Utah in the year 2000. This achievement was proof that a small, innovative team could out-compete and out-innovate much larger players by putting the customer and cutting-edge technology first.
            </p>
          </div>
        </section>

        {/* Key Takeaways */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Takeaways</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed">
              This project demonstrated that complex, long-standing problems in legacy systems can be solved with <strong>innovative thinking and targeted integration</strong>.               It&apos;s not always about tearing down the old; sometimes, it&apos;s about strategically building new layers that enable old systems to perform in a modern world. This approach delivers a fast return on investment and minimizes risk.
            </p>
          </div>
        </section>
      </div>

      {/* CTA Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Disrupt Your Industry?
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Let&apos;s discuss how we can help you build innovative solutions and achieve rapid growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started Today
            </a>
            <a 
              href="/case-studies" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              View All Case Studies
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
