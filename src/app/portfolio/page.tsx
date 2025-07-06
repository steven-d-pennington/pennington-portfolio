'use client';

import { useState } from 'react';

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', name: 'All Projects' },
    { id: 'aws', name: 'AWS & Cloud' },
    { id: 'saas', name: 'SaaS Platforms' },
    { id: 'legacy', name: 'Legacy Systems' },
    { id: 'infrastructure', name: 'Infrastructure' }
  ];

  const projects = [
    {
      id: 1,
      title: 'Extended Care Professional LLC',
      description: 'Led AWS migration and developed new features for SaaS platform, helping become the second-leading provider in long-term care software industry.',
      image: '/api/placeholder/400/300',
      category: 'saas',
      technologies: ['AWS', 'Node.js', 'SaaS', 'Cloud Migration', 'Database Design'],
      liveUrl: '#',
      githubUrl: '#',
      featured: true
    },
    {
      id: 2,
      title: 'NetWORLD Connections',
      description: 'Built entire ISP from ground up including accounting, customer billing, software repository, and one of the first web-based email portals.',
      image: '/api/placeholder/400/300',
      category: 'infrastructure',
      technologies: ['Full Stack', 'Billing Systems', 'Network Infrastructure', 'Email Portal'],
      liveUrl: '#',
      githubUrl: '#',
      featured: true
    },
    {
      id: 3,
      title: 'Oregon Employment Division',
      description: 'ColdFusion Developer - Increased claim processing speed from a full day to just seconds through performance optimization.',
      image: '/api/placeholder/400/300',
      category: 'legacy',
      technologies: ['ColdFusion', 'SQL', 'Performance Optimization'],
      liveUrl: '#',
      githubUrl: '#',
      featured: false
    },
    {
      id: 4,
      title: 'AWS Cloud Architecture',
      description: 'Designed and implemented scalable cloud-native solutions using EC2, ECS, S3, ALB, CloudFront, and CloudFormation.',
      image: '/api/placeholder/400/300',
      category: 'aws',
      technologies: ['AWS', 'CloudFormation', 'EC2', 'ECS', 'S3', 'CloudFront'],
      liveUrl: '#',
      githubUrl: '#',
      featured: false
    },
    {
      id: 5,
      title: 'DevOps Pipeline Setup',
      description: 'Implemented CI/CD pipelines with Azure DevOps, monitoring with Sentry.io and CloudWatch for automated deployment.',
      image: '/api/placeholder/400/300',
      category: 'aws',
      technologies: ['Azure DevOps', 'CI/CD', 'Sentry.io', 'CloudWatch'],
      liveUrl: '#',
      githubUrl: '#',
      featured: false
    },
    {
      id: 6,
      title: 'Database Optimization',
      description: 'Performance tuning and optimization of MSSQL, PostgreSQL, and MySQL databases for high-traffic applications.',
      image: '/api/placeholder/400/300',
      category: 'legacy',
      technologies: ['MSSQL', 'PostgreSQL', 'MySQL', 'Performance Tuning'],
      liveUrl: '#',
      githubUrl: '#',
      featured: false
    }
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              My Portfolio
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A collection of projects that showcase my skills, creativity, and problem-solving abilities. 
              Each project represents a unique challenge and solution.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap justify-center gap-4">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Project Image</span>
                  </div>
                  {project.featured && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span 
                        key={tech} 
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <a 
                      href={project.liveUrl}
                      className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Live Demo
                    </a>
                    <a 
                      href={project.githubUrl}
                      className="flex-1 border border-gray-300 text-gray-700 text-center py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No projects found for the selected category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Like What You See?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Let&#39;s work together to bring your next project to life. I&#39;m always excited to take on new challenges.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start a Project
            </a>
            <a 
              href="/services" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              View Services
            </a>
          </div>
        </div>
      </section>
    </div>
  );
} 