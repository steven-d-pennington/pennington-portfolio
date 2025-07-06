export default function About() {
  const skills = [
    {
      category: 'Languages',
      technologies: ['Node.js', 'JavaScript', 'ColdFusion', 'SQL', 'Python', 'Express']
    },
    {
      category: 'Cloud & Infrastructure',
      technologies: ['AWS (EC2, ECS, S3, ALB, CloudFront, CloudFormation, Organizations, IAM, Lambda, RDS)', 'Cloudflare', 'Azure DevOps']
    },
    {
      category: 'DevOps & Observability',
      technologies: ['CloudFormation', 'AWS Organizations', 'IAM', 'Sentry.io', 'AWS CloudWatch']
    },
    {
      category: 'Databases',
      technologies: ['MSSQL', 'PostgreSQL', 'MySQL']
    }
  ];

  const experience = [
    {
      year: 'Current',
      title: 'Senior Software Engineer',
      company: 'Extended Care Professional LLC',
      description: 'Led the migration to AWS and developed new features for our SaaS platform, helping us become the second-leading provider in our industry for long-term care software.'
    },
    {
      year: 'Previous',
      title: 'Founder, Developer & Systems Engineer',
      company: 'NetWORLD Connections',
      description: 'Built an entire internet service provider from the ground up including all accounting, customer billing, a software repository, and one of the first web-based email portals. Became the 2nd leading provider in Salt Lake City, UT, and deployed a city-wide wireless network.'
    },
    {
      year: 'Previous',
      title: 'ColdFusion Developer',
      company: 'Oregon Employment Division',
      description: 'Helped increase claim processing speed from a full day to just seconds.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About Me
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              I&#39;m a passionate technologist with extensive experience building, scaling, and securing cloud-native applications. 
              My expertise spans backend development, DevOps, cloud architecture, and SaaS solutions for organizations of all sizes.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                My Journey
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  My career has been defined by a passion for technology and a drive to solve complex problems. 
                  From my early days as a ColdFusion developer to founding and building an entire ISP from the ground up, 
                  I&#39;ve always been drawn to challenges that push the boundaries of what&#39;s possible.
                </p>
                <p>
                  At NetWORLD Connections, I had the incredible opportunity to build an entire internet service provider 
                  from scratch. This included developing all the accounting systems, customer billing platforms, 
                  a software repository, and one of the first web-based email portals. We became the second-leading 
                  provider in Salt Lake City and successfully deployed a city-wide wireless network.
                </p>
                <p>
                  Currently, I&#39;m diving deep into AI/ML and keeping up with the latest tech trends while enjoying 
                  every moment with my grandkids. I&#39;m always eager to learn something new—especially about AI 
                  (before it takes over the world!).
                </p>
              </div>
            </div>
            <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Profile Image</span>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Skills & Technologies
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              I&#39;ve worked with a wide range of technologies and tools throughout my career.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {skills.map((skillGroup) => (
              <div key={skillGroup.category} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {skillGroup.category}
                </h3>
                <div className="space-y-2">
                  {skillGroup.technologies.map((tech) => (
                    <div key={tech} className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-gray-700 text-sm">{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Professional Experience
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              My career has been focused on delivering high-quality solutions for various organizations and industries.
            </p>
          </div>
          <div className="space-y-8">
            {experience.map((exp, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-8 py-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{exp.title}</h3>
                  <span className="text-blue-600 font-medium">{exp.year}</span>
                </div>
                <p className="text-gray-600 mb-2">{exp.company}</p>
                <p className="text-gray-700">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What I Value
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide my work and help me deliver the best possible results.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality</h3>
              <p className="text-gray-600">
                I believe in writing clean, maintainable code that stands the test of time.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Performance</h3>
              <p className="text-gray-600">
                Fast, responsive applications that provide excellent user experiences.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Collaboration</h3>
              <p className="text-gray-600">
                Working closely with clients to understand needs and deliver solutions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 