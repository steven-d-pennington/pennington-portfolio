import Link from 'next/link';

export default function Home() {
  const skills = [
    { name: 'React/Next.js', icon: '⚛️' },
    { name: 'Node.js', icon: '�' },
    { name: 'TypeScript', icon: '📘' },
    { name: 'AWS Cloud', icon: '☁️' },
    { name: 'Docker', icon: '🐳' },
    { name: 'PostgreSQL', icon: '�' },
  ];

  const featuredProjects = [
    {
      title: 'E-Commerce Platform Migration',
      description: 'Migrated legacy e-commerce platform to modern microservices architecture on AWS, improving performance by 300% and reducing infrastructure costs by 60%',
      tech: ['AWS', 'Microservices', 'Node.js', 'PostgreSQL'],
      image: '/api/placeholder/400/250'
    },
    {
      title: 'Healthcare SaaS Modernization',
      description: 'Modernized monolithic healthcare application into scalable cloud-native solution, serving 100,000+ users with 99.9% uptime',
      tech: ['React', 'Node.js', 'AWS Lambda', 'DynamoDB'],
      image: '/api/placeholder/400/250'
    },
    {
      title: 'Real-time Analytics Dashboard',
      description: 'Built real-time data visualization platform with custom reporting and automated insights for enterprise clients',
      tech: ['Next.js', 'Python', 'Redis', 'Chart.js'],
      image: '/api/placeholder/400/250'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to Monkey LoveStack
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Full-Stack Development & Cloud Solutions
            </p>
            <p className="text-lg md:text-xl mb-12 text-blue-200 max-w-3xl mx-auto">
              We&apos;re a passionate team of technologists specializing in bringing ideas to life on the web. 
              Our expertise spans full-stack development, cloud migrations, and modernizing monolithic applications. 
              We build applications and handle deployment to any cloud provider or on-premises infrastructure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/projects" 
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                View Our Work
              </Link>
              <Link 
                href="/contact" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Start Your Project
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Technologies We Master
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We stay current with modern development practices and tools to deliver cutting-edge solutions.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {skills.map((skill) => (
              <div key={skill.name} className="text-center group">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {skill.icon}
                </div>
                <h3 className="font-semibold text-gray-900">{skill.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Client Success Stories
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Here are some of our most impactful projects that showcase our expertise in full-stack development and cloud modernization.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Project Image</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span 
                        key={tech} 
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link 
              href="/projects" 
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Application?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Let&apos;s discuss how we can help bring your ideas to life with modern, scalable solutions and seamless cloud deployment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get a Quote
            </Link>
            <Link 
              href="/services" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Our Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
