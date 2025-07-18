export default function Services() {
  const services = [
    {
      title: 'Full-Stack Web Development',
      description: 'Complete web applications built with modern technologies from frontend to backend.',
      features: [
        'React, Next.js, and Vue.js development',
        'Node.js and Python backend services',
        'API design and development',
        'Database design and optimization',
        'Real-time features and WebSocket integration',
        'Responsive design and mobile optimization'
      ],
      icon: '🌐'
    },
    {
      title: 'Cloud Migration & Modernization',
      description: 'Transform legacy applications into modern, cloud-native solutions.',
      features: [
        'Monolith to microservices migration',
        'AWS, Azure, and Google Cloud deployment',
        'Legacy system modernization',
        'Performance optimization and scaling',
        'Zero-downtime migration strategies',
        'Cost optimization and monitoring'
      ],
      icon: '☁️'
    },
    {
      title: 'Custom Application Development',
      description: 'Bespoke software solutions tailored to your specific business needs.',
      features: [
        'E-commerce platforms and marketplaces',
        'Data visualization dashboards',
        'CRM and business management tools',
        'API gateways and integration platforms',
        'Real-time analytics and reporting',
        'Multi-tenant SaaS applications'
      ],
      icon: '⚡'
    },
    {
      title: 'Infrastructure & DevOps',
      description: 'Complete infrastructure solutions with automated deployment and monitoring.',
      features: [
        'Infrastructure as Code (Terraform, CloudFormation)',
        'CI/CD pipeline setup and management',
        'Container orchestration with Docker and Kubernetes',
        'Monitoring and observability solutions',
        'Security and compliance implementation',
        'Automated backup and disaster recovery'
      ],
      icon: '�️'
    }
  ];

  const process = [
    {
      step: 1,
      title: 'Discovery & Planning',
      description: 'Understanding your requirements, goals, and technical needs to create a comprehensive project plan.'
    },
    {
      step: 2,
      title: 'Design & Prototyping',
      description: 'Creating wireframes, mockups, and prototypes to visualize the solution before development begins.'
    },
    {
      step: 3,
      title: 'Development',
      description: 'Building your application using modern technologies and best practices with regular updates.'
    },
    {
      step: 4,
      title: 'Testing & Quality Assurance',
      description: 'Thorough testing to ensure your application works flawlessly across all devices and scenarios.'
    },
    {
      step: 5,
      title: 'Deployment & Launch',
      description: 'Deploying your application to production with proper monitoring and support.'
    },
    {
      step: 6,
      title: 'Maintenance & Support',
      description: 'Ongoing support, updates, and maintenance to keep your application running smoothly.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Services
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From concept to deployment, we provide comprehensive development services to help you 
              bring your ideas to life on the web with modern, scalable solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What We Can Do For You
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We specialize in creating modern, scalable solutions that drive business growth and exceed user expectations.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Development Process
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A proven methodology that ensures your project is delivered on time, within budget, and exceeds expectations.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {process.map((step, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {step.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Flexible Pricing Options
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We offer various engagement models to fit your project needs and budget requirements.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Hourly Rate</h3>
              <div className="text-3xl font-bold text-blue-600 mb-4">$75/hour</div>
              <p className="text-gray-600 mb-4 text-sm">
                Perfect for smaller projects or ongoing maintenance work.
              </p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>• Flexible scheduling</li>
                <li>• Pay only for work done</li>
                <li>• Quick turnaround</li>
                <li>• Ongoing support</li>
              </ul>
            </div>
            <div className="bg-blue-600 rounded-lg p-6 text-center text-white">
              <h3 className="text-xl font-semibold mb-2">Project-Based</h3>
              <div className="text-3xl font-bold mb-4">Custom Quote</div>
              <p className="text-blue-100 mb-4 text-sm">
                Fixed-price projects with clear deliverables and timelines.
              </p>
              <ul className="text-sm text-blue-100 space-y-2 mb-6">
                <li>• Defined scope and timeline</li>
                <li>• Fixed budget</li>
                <li>• Milestone payments</li>
                <li>• Post-launch support</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Retainer</h3>
              <div className="text-3xl font-bold text-blue-600 mb-4">$2,500/month</div>
              <p className="text-gray-600 mb-4 text-sm">
                Dedicated development time for ongoing projects and maintenance.
              </p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>• 40 hours per month</li>
                <li>• Priority support</li>
                <li>• Regular updates</li>
                <li>• Long-term partnership</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Let&apos;s discuss your project requirements and find the perfect solution for your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get a Free Quote
            </a>
            <a 
              href="/case-studies" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              View Case Studies
            </a>
          </div>
        </div>
      </section>
    </div>
  );
} 