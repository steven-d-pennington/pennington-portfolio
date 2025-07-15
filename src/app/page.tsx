import Link from 'next/link';

export default function Home() {
  const skills = [
    { 
      name: 'React/Next.js', 
      icon: (
        <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
          <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278l-.05.005zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295l-.001-.001zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132l.026-.002zm4.64 2.97c.69.07 1.36.166 2.001.27.165.27.323.54.475.82.154.28.304.579.453.88-.63.197-1.305.347-2.02.416-.52-.73-1.07-1.416-1.64-2.054l.73-.332zm-2.45.28c-.57.64-1.12 1.32-1.64 2.05-.72-.07-1.39-.22-2.02-.42.15-.3.3-.6.45-.88.15-.28.32-.55.48-.82.64-.11 1.31-.2 2.001-.27l-.27.34zm-1.338 3.81c-.84-.196-1.6-.48-2.26-.82-.65-.33-1.17-.71-1.53-1.09.36-.38.88-.76 1.53-1.09.66-.34 1.42-.62 2.26-.82.17.64.37 1.31.6 1.98-.23.67-.43 1.34-.6 1.98zm.64 2.01c.23.69.43 1.35.6 1.99-.84.2-1.6.48-2.26.82-.65.33-1.17.71-1.53 1.09.36.38.88.76 1.53 1.09.66.34 1.42.62 2.26.82-.17-.64-.37-1.3-.6-1.98l.0-.83zm1.338 3.81c.57-.64 1.12-1.32 1.64-2.05.72.07 1.39.22 2.02.42-.15.3-.3.6-.45.88-.15.28-.32.55-.48.82-.64.11-1.31.2-2.001.27l.27-.34zm2.45-.28c.52.73 1.07 1.416 1.64 2.054-.73.33-1.47.24-2.02-.416.63-.197 1.305-.347 2.02-.416.52-.73 1.07-1.416 1.64-2.054zm1.338-3.81c.84.196 1.6.48 2.26.82.65.33 1.17.71 1.53 1.09-.36.38-.88.76-1.53 1.09-.66.34-1.42.62-2.26.82-.17-.64-.37-1.31-.6-1.98.23-.67.43-1.34.6-1.98z"/>
          </svg>
        </div>
      )
    },
    { 
      name: 'Node.js', 
      icon: (
        <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
          <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.570,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.273-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z M19.099,13.993 c0-1.9-1.284-2.406-3.987-2.763c-2.731-0.361-3.009-0.548-3.009-1.187c0-0.528,0.235-1.233,2.258-1.233 c1.807,0,2.473,0.389,2.747,1.607c0.024,0.115,0.129,0.199,0.247,0.199h1.141c0.071,0,0.138-0.031,0.186-0.081 c0.048-0.054,0.074-0.123,0.067-0.196c-0.177-2.098-1.571-3.076-4.388-3.076c-2.508,0-4.004,1.058-4.004,2.833 c0,1.925,1.488,2.457,3.895,2.695c2.88,0.282,3.103,0.703,3.103,1.269c0,0.983-0.789,1.402-2.642,1.402 c-2.327,0-2.839-0.584-3.011-1.742c-0.02-0.124-0.126-0.215-0.253-0.215h-1.137c-0.141,0-0.254,0.112-0.254,0.253 c0,1.482,0.806,3.248,4.655,3.248C17.501,17.007,19.099,15.91,19.099,13.993z"/>
          </svg>
        </div>
      )
    },
    { 
      name: 'TypeScript', 
      icon: (
        <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
          <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.213.776.213 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"/>
          </svg>
        </div>
      )
    },
    { 
      name: 'AWS Cloud', 
      icon: (
        <div className="w-12 h-12 mx-auto mb-3 bg-orange-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
          <svg className="w-8 h-8 text-orange-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.763 10.036c0-.296.032-.535.088-.71.064-.176.144-.368.256-.576.048-.08.064-.144.064-.192 0-.08-.048-.144-.16-.144-.096 0-.192.016-.32.064a2.62 2.62 0 0 0-1.408 1.088 2.651 2.651 0 0 0-.24 1.152c0 .624.144 1.152.4 1.536.256.4.608.688 1.072.912.464.208 1.008.32 1.632.32.336 0 .704-.048 1.088-.144.384-.096.624-.192.88-.336.064-.032.112-.08.112-.144a.112.112 0 0 0-.112-.112c-.048 0-.096.016-.16.048-.24.112-.528.208-.848.272-.336.064-.672.096-.976.096-.544 0-1.008-.128-1.376-.368a2.24 2.24 0 0 1-.896-1.024 3.355 3.355 0 0 1-.336-1.568zm15.024 2.704c-.67.496-1.646.928-2.912 1.472-1.28.528-2.464.8-3.552.8-1.632 0-3.136-.4-4.416-1.232-.144-.08-.224-.112-.224-.112s.112-.08.304.048c1.248.8 2.656 1.232 4.224 1.232.976 0 2.016-.176 3.104-.544 1.088-.368 1.968-.784 2.64-1.248.672-.464 1.008-.8 1.008-1.056 0-.112-.064-.176-.176-.176-.064 0-.16.032-.304.112z"/>
          </svg>
        </div>
      )
    },
    { 
      name: 'Docker', 
      icon: (
        <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
          <svg className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.186m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338 0-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983 0 1.954-.09 2.874-.266a12.025 12.025 0 003.864-1.389 10.096 10.096 0 002.73-2.203 5.886 5.886 0 001.004-2.18l.283-.018.02-.02.017-.023a4.71 4.71 0 00.535-.024c.988 0 1.798-.429 2.340-1.266.098-.15.155-.6.155-.6l.088-.179-.344-.271z"/>
          </svg>
        </div>
      )
    },
    { 
      name: 'PostgreSQL', 
      icon: (
        <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
          <svg className="w-8 h-8 text-blue-700" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.128 0c-.995 0-1.801.33-2.132 1.607a6.472 6.472 0 0 0-.35 2.706c.026.456.063.92.11 1.39.068.67.148 1.35.24 2.04.066.49.137.98.214 1.47h-.001c.077.49.156.99.24 1.49.058.35.12.7.184 1.05.078.43.158.86.244 1.28.086.42.174.84.268 1.26.046.20.093.41.141.61h.001c.048.20.097.40.147.61.05.21.101.42.154.62.053.20.107.40.163.60.056.20.114.40.174.59.060.19.122.38.186.57.064.19.13.37.198.56.068.19.138.37.21.55.072.18.146.36.222.53.076.17.154.34.234.50.080.16.162.32.246.47.084.15.17.30.258.44.088.14.178.28.27.41.092.13.186.26.282.38.096.12.194.24.294.35.100.11.202.22.306.32.104.10.21.20.318.29.108.09.218.17.33.25.112.08.226.15.342.22.116.07.234.13.354.18.120.05.242.09.366.13.124.04.25.07.378.09.128.02.258.03.389.03.262 0 .516-.03.762-.09.246-.06.484-.15.714-.27.23-.12.45-.27.66-.45.21-.18.40-.39.57-.63.17-.24.31-.51.42-.81.11-.30.17-.63.17-.99 0-.73-.21-1.37-.63-1.92-.42-.55-1.01-.82-1.77-.82-.38 0-.72.08-1.02.24-.30.16-.54.39-.72.69-.18.30-.27.65-.27 1.05 0 .30.06.57.18.81.12.24.29.43.51.57.22.14.47.21.75.21.28 0 .53-.07.75-.21.22-.14.39-.33.51-.57.12-.24.18-.51.18-.81 0-.4-.09-.75-.27-1.05-.18-.30-.42-.53-.72-.69-.30-.16-.64-.24-1.02-.24-.76 0-1.35.27-1.77.82-.42.55-.63 1.19-.63 1.92 0 .36.06.69.17.99.11.30.25.57.42.81.17.24.36.45.57.63.21.18.43.33.66.45.23.12.47.21.71.27.24.06.49.09.76.09.131 0 .261-.01.389-.03.128-.02.254-.05.378-.09.124-.04.246-.08.366-.13.120-.05.238-.11.354-.18.116-.07.23-.14.342-.22.112-.08.222-.16.33-.25.108-.09.214-.19.318-.29.104-.10.206-.21.306-.32.100-.11.198-.23.294-.35.096-.12.19-.25.282-.38.092-.13.182-.27.27-.41.088-.14.178-.30.258-.44.084-.15.166-.31.246-.47.080-.16.158-.33.234-.50.076-.17.15-.35.222-.53.072-.18.142-.36.21-.55.068-.19.134-.37.198-.56.064-.19.126-.38.186-.57.060-.19.118-.39.174-.59.056-.20.11-.40.163-.60.053-.20.104-.41.154-.62.050-.21.099-.41.147-.61h.001c.048-.20.095-.41.141-.61.094-.42.182-.84.268-1.26.086-.42.166-.85.244-1.28.064-.35.126-.70.184-1.05.084-.50.163-1 .24-1.49h-.001c.077-.49.148-.98.214-1.47.092-.69.172-1.37.24-2.04.047-.47.084-.934.11-1.39a6.472 6.472 0 0 0-.35-2.706C18.929.33 18.123 0 17.128 0z"/>
          </svg>
        </div>
      )
    },
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
                {skill.icon}
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
