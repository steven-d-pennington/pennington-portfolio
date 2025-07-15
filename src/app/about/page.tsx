export default function About() {
  const skills = [
    {
      category: 'Frontend',
      technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vue.js', 'JavaScript']
    },
    {
      category: 'Backend & API',
      technologies: ['Node.js', 'Express', 'Python', 'REST APIs', 'GraphQL', 'Serverless Functions']
    },
    {
      category: 'Cloud & Infrastructure',
      technologies: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'CloudFormation']
    },
    {
      category: 'Databases',
      technologies: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'DynamoDB', 'Supabase']
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
              About Monkey LoveStack
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're a passionate team of technologists specializing in bringing ideas to life on the web. 
              Our expertise spans full-stack development, cloud migrations, and modernizing monolithic applications. 
              We build applications and handle deployment to any cloud provider or on-premises infrastructure.
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
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Monkey LoveStack was founded with a passion for technology and a drive to solve complex problems. 
                  Our journey has been defined by pushing the boundaries of what's possible, from modernizing legacy systems 
                  to building cutting-edge applications from the ground up.
                </p>
                <p>
                  We specialize in taking ideas and bringing them to life on the web. Whether it's migrating a monolithic 
                  application to modern microservices, building a brand new SaaS platform, or deploying to any cloud provider, 
                  our team has the expertise to handle every aspect of the development lifecycle.
                </p>
                <p>
                  Our approach combines deep technical knowledge with a focus on understanding our clients' unique needs. 
                  We stay current with the latest technologies and best practices, ensuring that every solution we deliver 
                  is modern, scalable, and built to last.
                </p>
              </div>
            </div>
            <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Team Photo Placeholder</span>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Technology Stack
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We work with modern technologies and tools to deliver cutting-edge solutions.
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
              Leadership & Expertise
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our team is led by experienced professionals with a proven track record of delivering successful projects.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                  <span className="text-gray-500 text-xs">Photo</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Steven Pennington</h3>
                  <p className="text-blue-600">Co-founder & Lead Engineer</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Steven brings extensive experience in full-stack development, cloud architecture, and leading complex 
                migration projects. His background includes founding an ISP from the ground up, leading AWS migrations 
                for SaaS platforms, and optimizing systems that serve hundreds of thousands of users.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-1">ISP Founder</h4>
                  <p className="text-blue-700 text-sm">Built NetWORLD Connections from ground up</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-1">Cloud Expert</h4>
                  <p className="text-green-700 text-sm">Led AWS migration for SaaS platform</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-1">Performance Optimizer</h4>
                  <p className="text-purple-700 text-sm">Reduced processing time from days to seconds</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide our work and help us deliver exceptional results for our clients.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality First</h3>
              <p className="text-gray-600">
                We believe in writing clean, maintainable code and building solutions that stand the test of time.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Performance Driven</h3>
              <p className="text-gray-600">
                Fast, responsive applications that provide excellent user experiences and scale with your business.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Client Partnership</h3>
              <p className="text-gray-600">
                Working closely with clients to understand their needs and deliver solutions that exceed expectations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 