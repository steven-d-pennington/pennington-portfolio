export default function EMARMigrationCaseStudy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-4xl">
            <div className="flex items-center mb-6">
              <span className="bg-blue-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                Cloud Migration & Modernization
              </span>
              <span className="ml-3 text-blue-100">• Healthcare Technology</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              From Legacy to Leader: A Cloud Native Transformation Journey in the EMAR Market
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              How a SaaS provider specializing in Electronic Medication Administration Record (EMAR) systems successfully transformed from traditional on-premises architecture to a modern cloud-native platform, capturing over 10% market share.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold">10%+</div>
                <div className="text-sm text-blue-100">Market Share</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">99.9%</div>
                <div className="text-sm text-blue-100">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">70%</div>
                <div className="text-sm text-blue-100">Faster Support</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">Weekly</div>
                <div className="text-sm text-blue-100">Deployments</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex flex-wrap gap-4 text-sm">
            <a href="#executive-summary" className="text-blue-600 hover:text-blue-700">Executive Summary</a>
            <a href="#company-background" className="text-gray-600 hover:text-gray-900">Company Background</a>
            <a href="#challenge" className="text-gray-600 hover:text-gray-900">The Challenge</a>
            <a href="#strategy" className="text-gray-600 hover:text-gray-900">Migration Strategy</a>
            <a href="#results" className="text-gray-600 hover:text-gray-900">Results & Impact</a>
            <a href="#lessons" className="text-gray-600 hover:text-gray-900">Lessons Learned</a>
          </nav>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Executive Summary */}
        <section id="executive-summary" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Executive Summary</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed">
              This case study examines how a SaaS provider specializing in Electronic Medication Administration Record (EMAR) systems for assisted living communities successfully transformed from a traditional on-premises monolithic architecture to a modern cloud-native platform. This strategic migration enabled the company to capture over 10% market share and establish itself as an industry leader, demonstrating the transformative power of cloud adoption in the healthcare technology sector.
            </p>
          </div>
        </section>

        {/* Company Background */}
        <section id="company-background" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Company Background</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed">
              The organization began as a traditional software vendor serving assisted living communities with an on-premises EMAR solution. The system helped facilities manage medication administration, track compliance, and maintain regulatory documentation. However, the legacy architecture presented significant challenges in scaling operations, delivering new features, and meeting the evolving needs of healthcare providers.
            </p>
          </div>
        </section>

        {/* The Challenge */}
        <section id="challenge" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Challenge: Legacy System Limitations</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Technical Constraints</h3>
              <p className="text-gray-700 mb-4">The existing monolithic on-premises system faced several critical limitations:</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Scalability bottlenecks:</strong> The monolithic architecture made it difficult to scale individual components based on demand</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Deployment complexity:</strong> Updates required coordinated releases across the entire system, leading to lengthy deployment cycles</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Maintenance overhead:</strong> On-premises installations required significant support resources for updates, patches, and troubleshooting</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Limited integration capabilities:</strong> The system struggled to integrate with other healthcare technologies and electronic health record systems</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Infrastructure costs:</strong> Managing hardware and infrastructure across multiple client sites created substantial operational expenses</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Market Pressures</h3>
              <p className="text-gray-700 mb-4">The assisted living industry was experiencing rapid digitization, with facilities demanding:</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Real-time access to medication data across multiple locations</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Mobile accessibility for nursing staff</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Seamless integration with pharmacy management systems</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Enhanced reporting and analytics capabilities</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Reduced total cost of ownership</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Faster implementation timelines</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Migration Strategy */}
        <section id="strategy" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Migration Strategy and Implementation</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Phase 1: Architecture Redesign</h3>
              <p className="text-gray-700 mb-4">The migration began with a comprehensive redesign of the system architecture:</p>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-4">
                <h4 className="font-semibold text-gray-900 mb-3">Microservices Architecture</h4>
                <p className="text-gray-700 mb-3">The monolithic application was decomposed into discrete microservices, each responsible for specific business functions such as:</p>
                <ul className="space-y-1 text-gray-700">
                  <li>• User authentication and authorization</li>
                  <li>• Medication scheduling and administration</li>
                  <li>• Reporting and analytics</li>
                  <li>• Integration services</li>
                  <li>• Notification systems</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Cloud-First Design</h4>
                <p className="text-gray-700 mb-3">The new architecture leveraged cloud-native services including:</p>
                <ul className="space-y-1 text-gray-700">
                  <li>• Containerized applications using Docker and Kubernetes</li>
                  <li>• Managed databases with automatic scaling and backup</li>
                  <li>• Message queues for asynchronous processing</li>
                  <li>• API gateways for service orchestration</li>
                  <li>• Content delivery networks for global performance</li>
                </ul>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Phase 2: Data Migration and Security</h3>
              <p className="text-gray-700 mb-4">Healthcare data migration required exceptional attention to security and compliance:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">HIPAA Compliance</h4>
                  <p className="text-blue-800 text-sm">Implementation of end-to-end encryption, audit logging, and access controls meeting healthcare regulatory requirements</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">Data Migration Strategy</h4>
                  <p className="text-green-800 text-sm">Development of automated migration tools to safely transfer years of historical medication records while maintaining data integrity</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">Security Framework</h4>
                  <p className="text-purple-800 text-sm">Implementation of zero-trust security principles with multi-factor authentication, role-based access controls, and continuous monitoring</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Phase 3: Feature Enhancement and Integration</h3>
              <p className="text-gray-700 mb-4">The cloud platform enabled significant feature enhancements:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Real-Time Synchronization</h4>
                  <p className="text-gray-700 text-sm">Medication records could be accessed and updated in real-time across multiple devices and locations</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Advanced Analytics</h4>
                  <p className="text-gray-700 text-sm">Cloud-based data warehousing enabled sophisticated reporting and predictive analytics for medication management</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Third-Party Integrations</h4>
                  <p className="text-gray-700 text-sm">APIs facilitated seamless integration with pharmacy systems, electronic health records, and other healthcare technologies</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Mobile Optimization</h4>
                  <p className="text-gray-700 text-sm">Native mobile applications provided nursing staff with intuitive, tablet-based medication administration tools</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Results and Impact */}
        <section id="results" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Results and Business Impact</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Operational Excellence</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Reduced Deployment Time:</strong> Feature releases decreased from monthly cycles to weekly deployments
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Improved Reliability:</strong> Cloud infrastructure provided 99.9% uptime compared to 95% with on-premises systems
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Scalability:</strong> The platform could automatically scale to accommodate facility growth
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Support Efficiency:</strong> Remote troubleshooting and automated monitoring reduced support response times by 70%
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Market Position</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Market Share Growth:</strong> Achieved over 10% market share in the competitive EMAR space
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Customer Acquisition:</strong> The modern platform attracted new customers who previously avoided on-premises solutions
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Customer Retention:</strong> Existing customers experienced improved satisfaction due to enhanced features and reliability
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Competitive Advantage:</strong> Cloud-native architecture enabled rapid innovation cycles
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Financial Performance</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Revenue Growth:</strong> SaaS subscription model provided predictable recurring revenue streams
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Cost Optimization:</strong> Elimination of hardware management and reduced support overhead improved profit margins
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Faster Sales Cycles:</strong> Cloud deployment reduced implementation timelines from months to weeks
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong>Operational Efficiency:</strong> Automated operations reduced staffing requirements while improving service quality
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Key Success Factors */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Success Factors</h2>
          <p className="text-gray-700 mb-6">Several factors contributed to the successful transformation:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Leadership Commitment</h3>
              <p className="text-gray-700 text-sm">Executive leadership provided unwavering support for the multi-year transformation, recognizing it as essential for long-term competitiveness rather than just a technology upgrade.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Customer-Centric Approach</h3>
              <p className="text-gray-700 text-sm">The migration strategy prioritized customer needs and regulatory requirements, ensuring the new platform solved real-world problems in assisted living facilities.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Incremental Migration</h3>
              <p className="text-gray-700 text-sm">The phased approach minimized risk while allowing continuous learning and adjustment throughout the transformation process.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Team Development</h3>
              <p className="text-gray-700 text-sm">Investment in team training and cloud expertise ensured internal capabilities matched the new technology stack.</p>
            </div>
          </div>
        </section>

        {/* Lessons Learned */}
        <section id="lessons" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Lessons Learned</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Technical Insights</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Start with architecture:</strong> Proper microservices design is crucial before beginning migration</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Security first:</strong> Healthcare compliance requirements must be embedded in the architecture from day one</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Monitor everything:</strong> Cloud platforms provide unprecedented visibility into system performance and user behavior</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Embrace automation:</strong> Automated testing, deployment, and monitoring are essential for managing distributed systems</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Business Insights</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Change management is critical:</strong> User adoption requires comprehensive training and change management programs</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Communicate value clearly:</strong> Customers need to understand the benefits of cloud migration beyond just technical improvements</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Plan for growth:</strong> Cloud architecture should anticipate future scale and feature requirements</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Measure success:</strong> Clear metrics help demonstrate ROI and guide continued investment</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Conclusion</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              This case study demonstrates how a strategic cloud-native migration can transform a traditional software company into an industry leader. The transition from on-premises monolithic systems to cloud-native architecture enabled not just technical improvements, but fundamental business transformation that captured significant market share in a competitive healthcare technology market.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              The success required more than just technology migration - it demanded comprehensive organizational change, customer-focused design, and unwavering commitment to healthcare compliance and security. The result was a modern, scalable platform that serves as the foundation for continued innovation and market leadership in the evolving assisted living technology landscape.
            </p>
            <p className="text-gray-700 leading-relaxed">
              For healthcare technology providers still operating legacy systems, this transformation journey illustrates both the challenges and tremendous opportunities that cloud-native migration can provide when executed with proper planning, commitment, and focus on customer value creation.
            </p>
          </div>
        </section>
      </div>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20">
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
              href="/case-studies" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              View All Case Studies
            </a>
          </div>
        </div>
      </section>
    </div>
  );
} 