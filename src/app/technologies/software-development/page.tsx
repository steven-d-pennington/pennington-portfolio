export default function SoftwareDevelopmentPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Software Development Stacks
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Details about our expertise in various programming languages, frameworks, and development methodologies will be listed here soon.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Placeholder */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center text-gray-600">
          <p className="text-lg mb-4">Content for software development technologies is coming soon!</p>
          <p>Please check back later for more details on our capabilities in:</p>
          <ul className="list-disc list-inside inline-block text-left mt-4">
            <li>Frontend Frameworks (React, Vue, Angular)</li>
            <li>Backend Technologies (Node.js, Python, Java, Go)</li>
            <li>Databases (SQL, NoSQL)</li>
            <li>Mobile Development (React Native, Flutter)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
