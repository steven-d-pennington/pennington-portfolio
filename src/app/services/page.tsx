export default function Services() {
  const services = [
    {
      title: 'AWS Cloud Architecture',
      description: 'Design and implement scalable cloud-native solutions using AWS services.',
      features: [
        'EC2, ECS, S3, ALB, CloudFront setup and optimization',
        'CloudFormation and Infrastructure as Code',
        'AWS Organizations and IAM management',
        'Lambda serverless development',
        'RDS database design and optimization',
        'Cost optimization and security best practices'
      ],
      icon: '☁️'
    },
    {
      title: 'Backend Development',
      description: 'Robust backend systems built with modern technologies and best practices.',
      features: [
        'Node.js and JavaScript development',
        'ColdFusion application development',
        'API design and development',
        'Database design and optimization',
        'Performance optimization',
        'Security implementation'
      ],
      icon: '⚙️'
    },
    {
      title: 'DevOps & Infrastructure',
      description: 'Complete DevOps solutions for automated deployment and monitoring.',
      features: [
        'CI/CD pipeline setup and management',
        'CloudFormation and Infrastructure as Code',
        'Monitoring with Sentry.io and CloudWatch',
        'Azure DevOps integration',
        'Security and compliance',
        'Performance monitoring and optimization'
      ],
      icon: '🔧'
    },
    {
      title: 'SaaS Platform Development',
      description: 'End-to-end SaaS solutions from concept to deployment.',
      features: [
        'Multi-tenant architecture design',
        'User management and authentication',
        'Billing and subscription systems',
        'API development and integration',
        'Scalable database design',
        'Performance optimization'
      ],
      icon: '🛠️'
    },
    {
      title: 'Database Design & Optimization',
      description: 'Efficient database architecture for high-performance applications.',
      features: [
        'MSSQL, PostgreSQL, MySQL design',
        'Performance optimization and tuning',
        'Data migration strategies',
        'Backup and recovery systems',
        'Security implementation',
        'Monitoring and maintenance'
      ],
      icon: '🗄️'
    },
    {
      title: 'Legacy System Migration',
      description: 'Seamless migration of legacy systems to modern cloud platforms.',
      features: [
        'ColdFusion to modern stack migration',
        'AWS migration planning and execution',
        'Data migration and validation',
        'Performance improvement',
        'Security enhancement',
        'Training and documentation'
      ],
      icon: '🔄'
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
              Services I Offer
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From concept to deployment, I provide comprehensive development services to help you 
              build the perfect solution for your business needs.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What I Can Do For You
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              I specialize in creating modern, scalable solutions that drive business growth and user engagement.
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
              My Development Process
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
              I offer various engagement models to fit your project needs and budget requirements.
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
            Let&#39;s discuss your project requirements and find the perfect solution for your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get a Free Quote
            </a>
            <a 
              href="/portfolio" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              View My Work
            </a>
          </div>
        </div>
      </section>
    </div>
  );
} 