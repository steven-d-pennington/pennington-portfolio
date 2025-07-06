import Link from 'next/link';

export default function Home() {
  const skills = [
    { name: 'Node.js', icon: '🟢' },
    { name: 'JavaScript', icon: '📜' },
    { name: 'ColdFusion', icon: '❄️' },
    { name: 'AWS', icon: '☁️' },
    { name: 'DevOps', icon: '⚙️' },
    { name: 'Python', icon: '🐍' },
  ];

  const featuredProjects = [
    {
      title: 'Oregon Employment Division',
      description: 'ColdFusion Developer - Increased claim processing speed from a full day to just seconds',
      tech: ['ColdFusion', 'SQL', 'Performance Optimization'],
      image: '/api/placeholder/400/250'
    },
    {
      title: 'NetWORLD Connections',
      description: 'Founder, Developer & Systems Engineer - Built entire ISP from ground up including billing, email portal, and city-wide wireless network',
      tech: ['Full Stack', 'Billing Systems', 'Network Infrastructure'],
      image: '/api/placeholder/400/250'
    },
    {
      title: 'Extended Care Professional LLC',
      description: 'Senior Software Engineer - Led AWS migration and developed SaaS platform features, becoming 2nd leading provider in long-term care software',
      tech: ['AWS', 'SaaS', 'Node.js', 'Cloud Migration'],
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
              Hi, I&#39;m Steven Pennington
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Senior Software Engineer / AWS Cloud Architect
            </p>
            <p className="text-lg md:text-xl mb-12 text-blue-200 max-w-3xl mx-auto">
              I&#39;m a passionate technologist with extensive experience building, scaling, and securing cloud-native applications. 
              My expertise spans backend development, DevOps, cloud architecture, and SaaS solutions for organizations of all sizes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/portfolio" 
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                View My Work
              </Link>
              <Link 
                href="/contact" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Get In Touch
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
              Technologies I Work With
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              I stay current with modern development practices and tools to deliver the best solutions.
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
              Career Highlights
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Here are some of my most significant career achievements that showcase my skills and approach to problem-solving.
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
              href="/portfolio" 
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
            Ready to Start Your Next Project?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Let&#39;s discuss how I can help bring your ideas to life with modern, scalable solutions.
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
              View Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
