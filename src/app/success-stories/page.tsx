import Image from 'next/image';

export default function SuccessStoriesPage() {
  const stories = [
    {
      title: "E-Commerce Platform Migration",
      client: "Retail Company",
      challenge: "Legacy monolithic system couldn't handle growth",
      solution: "Migrated to microservices architecture on AWS",
      results: ["300% performance improvement", "60% cost reduction", "99.9% uptime"],
      image: "/ecom-migration.png"
    },
    {
      title: "Healthcare SaaS Modernization", 
      client: "Healthcare Provider",
      challenge: "Outdated healthcare management system",
      solution: "Modernized to cloud-native React application",
      results: ["100,000+ users served", "99.9% uptime", "50% faster response times"],
      image: "/ecp.png"
    },
    {
      title: "Real-time Analytics Dashboard",
      client: "Enterprise Client",
      challenge: "Need for real-time business insights",
      solution: "Built custom analytics platform with automated reporting",
      results: ["Real-time data processing", "Custom reporting", "Automated insights"],
      image: "/analytics.png"
    }
  ];

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real transformations and measurable results from our client partnerships.
          </p>
        </div>

        <div className="space-y-12">
          {stories.map((story, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{story.title}</h2>
                  <p className="text-blue-600 font-medium mb-4">{story.client}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Challenge:</h3>
                      <p className="text-gray-600">{story.challenge}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Solution:</h3>
                      <p className="text-gray-600">{story.solution}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Results:</h3>
                      <ul className="space-y-1">
                        {story.results.map((result, i) => (
                          <li key={i} className="text-green-600 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {result}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 relative">
                  <Image 
                    src={story.image} 
                    alt={story.title}
                    width={400}
                    height={256}
                    className="w-full h-64 object-contain rounded-lg"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}