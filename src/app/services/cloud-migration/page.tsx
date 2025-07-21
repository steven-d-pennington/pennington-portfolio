export default function CloudMigrationPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Cloud Migration Services</h1>
          <div className="prose prose-lg text-gray-600">
            <p>
              Transform your legacy applications for the cloud. We help businesses migrate 
              their existing infrastructure to modern cloud platforms with minimal downtime.
            </p>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Cloud Platforms We Support</h2>
            <ul className="space-y-2">
              <li>Amazon Web Services (AWS)</li>
              <li>Microsoft Azure</li>
              <li>Google Cloud Platform</li>
              <li>Digital Ocean & Linode</li>
              <li>Hybrid Cloud Solutions</li>
            </ul>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Migration Process</h2>
            <ul className="space-y-2">
              <li>Assessment & Planning</li>
              <li>Architecture Design</li>
              <li>Data Migration</li>
              <li>Application Refactoring</li>
              <li>Testing & Validation</li>
              <li>Go-Live Support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}