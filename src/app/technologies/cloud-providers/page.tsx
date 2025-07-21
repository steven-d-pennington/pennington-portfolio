import Link from 'next/link';

export default function CloudProvidersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Cloud Provider Stacks
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Our expertise spans across leading cloud platforms, enabling us to build and manage scalable, secure, and highly available solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* AWS Section */}
        <section id="aws" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Amazon Web Services (AWS)</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-8">
              Below is a comprehensive summary of AWS services and technologies used across my cloud infrastructure projects. This highlights my experience with modern AWS solutions, DevOps best practices, and scalable, secure architecture.
            </p>

            <h3 className="text-2xl font-semibold text-gray-900 mb-4">🚀 Compute & Containers</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6">
              <li><strong>Amazon ECS (Elastic Container Service)</strong> with Fargate</li>
              <li><strong>Amazon EC2</strong> (virtual machines, Windows/Linux clusters)</li>
              <li><strong>AWS Lambda</strong> (serverless functions)</li>
            </ul>

            <h3 className="text-2xl font-semibold text-gray-900 mb-4">🌐 Networking & Load Balancing</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6">
              <li><strong>Elastic Load Balancer (ALB/NLB)</strong></li>
              <li><strong>Amazon VPC</strong> (custom networking, subnets, routing)</li>
              <li><strong>AWS Client VPN</strong></li>
              <li><strong>Security Groups</strong> and <strong>NACLs</strong></li>
            </ul>

            <h3 className="text-2xl font-semibold text-gray-900 mb-4">💾 Storage & Databases</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6">
              <li><strong>Amazon RDS</strong> (SQL Server, PostgreSQL, etc.)</li>
              <li><strong>Amazon S3</strong> (object storage, backup, replication)</li>
              <li><strong>Amazon Redshift</strong> (data warehouse)</li>
              <li><strong>Amazon ElastiCache</strong> (Redis)</li>
            </ul>

            <h3 className="text-2xl font-semibold text-gray-900 mb-4">⚙️ DevOps & CI/CD</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6">
              <li><strong>AWS CodeArtifact</strong> (private package repositories)</li>
              <li><strong>AWS CodeDeploy</strong> (deployment automation)</li>
              <li><strong>AWS ECR</strong> (Elastic Container Registry for Docker images)</li>
            </ul>

            <h3 className="text-2xl font-semibold text-gray-900 mb-4">🔒 Identity, Security & Secrets</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6">
              <li><strong>AWS IAM</strong> (roles, policies, service-linked roles)</li>
              <li><strong>AWS Secrets Manager</strong> (secure secrets storage)</li>
              <li><strong>AWS KMS</strong> (encryption keys)</li>
              <li><strong>AWS SSM Parameter Store</strong> (configuration management)</li>
            </ul>

            <h3 className="text-2xl font-semibold text-gray-900 mb-4">📊 Monitoring & Logging</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6">
              <li><strong>Amazon CloudWatch</strong> (logs, metrics, alarms)</li>
              <li><strong>AWS SNS</strong> (notifications)</li>
              <li><strong>AWS S3</strong> (log archiving)</li>
            </ul>

            <h3 className="text-2xl font-semibold text-gray-900 mb-4">🔗 API & Messaging</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6">
              <li><strong>Amazon API Gateway</strong> (REST APIs)</li>
              <li><strong>Amazon EventBridge</strong> (event bus)</li>
              <li><strong>Amazon SQS/SNS</strong> (messaging/notifications)</li>
            </ul>

            <h3 className="text-2xl font-semibold text-gray-900 mb-4">🌍 Content Delivery & DNS</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6">
              <li><strong>Amazon CloudFront</strong> (CDN)</li>
              <li><strong>Amazon Route 53</strong> (DNS, health checks)</li>
              <li><strong>AWS Certificate Manager</strong> (SSL/TLS)</li>
            </ul>

            <h3 className="text-2xl font-semibold text-gray-900 mb-4">🛠️ Other Specialized Services</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6">
              <li><strong>AWS DMS</strong> (Database Migration Service)</li>
              <li><strong>AWS DataBrew</strong> (data preparation)</li>
              <li><strong>AWS CodeBuild/CodePipeline</strong></li>
              <li><strong>AWS Launch Wizard</strong> (SQL cluster automation)</li>
              <li><strong>AWS Audit Logging</strong> (S3, CloudWatch, SNS)</li>
            </ul>

            <p className="text-gray-700 leading-relaxed">
              <strong>Specialties:</strong> Multi-environment deployments, secure networking, container orchestration, automated CI/CD, data warehousing.
            </p>
          </div>
        </section>

        {/* Vercel Section */}
        <section id="vercel" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Vercel</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-8">
              Vercel is a cloud platform for frontend developers, providing the speed and reliability needed for modern web applications. It&apos;s optimized for Next.js and offers a seamless developer experience.
            </p>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">🚀 Compute & Hosting</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6">
              <li><strong>Serverless Functions (Edge Functions, Serverless Functions)</strong>: Equivalent to AWS Lambda for serverless compute.</li>
              <li><strong>Frontend Hosting</strong>: Optimized for Next.js, React, Vue, etc.</li>
            </ul>

            <h3 className="text-2xl font-semibold text-gray-900 mb-4">⚙️ DevOps & CI/CD</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6">
              <li><strong>Automatic Git Integrations</strong>: Built-in CI/CD for GitHub, GitLab, Bitbucket.</li>
              <li><strong>Instant Previews</strong>: For every Git push.</li>
            </ul>

            <h3 className="text-2xl font-semibold text-gray-900 mb-4">🌍 Content Delivery & DNS</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6">
              <li><strong>Global Edge Network</strong>: Similar to Amazon CloudFront for fast content delivery.</li>
              <li><strong>Custom Domains & SSL</strong>: Managed DNS and SSL certificates.</li>
            </ul>
          </div>
        </section>

        {/* Google Cloud Section */}
        <section id="google-cloud" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Google Cloud Platform (GCP)</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-8">
              Google Cloud Platform offers a suite of cloud computing services that runs on the same infrastructure that Google uses internally for its end-user products.
            </p>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">🚀 Compute & Containers</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6">
              <li><strong>Compute Engine</strong>: Equivalent to Amazon EC2 for virtual machines.</li>
              <li><strong>Google Kubernetes Engine (GKE)</strong>: Managed Kubernetes service, similar to Amazon EKS.</li>
              <li><strong>Cloud Functions</strong>: Serverless functions, equivalent to AWS Lambda.</li>
            </ul>

            <h3 className="text-2xl font-semibold text-gray-900 mb-4">💾 Storage & Databases</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6">
              <li><strong>Cloud Storage</strong>: Object storage, equivalent to Amazon S3.</li>
              <li><strong>Cloud SQL</strong>: Managed relational database service, equivalent to Amazon RDS.</li>
              <li><strong>BigQuery</strong>: Serverless data warehouse, similar to Amazon Redshift.</li>
            </ul>

            <h3 className="text-2xl font-semibold text-gray-900 mb-4">⚙️ DevOps & CI/CD</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6">
              <li><strong>Cloud Build</strong>: CI/CD service, similar to AWS CodeBuild/CodePipeline.</li>
              <li><strong>Artifact Registry</strong>: Universal package manager, similar to AWS CodeArtifact.</li>
            </ul>

            <h3 className="text-2xl font-semibold text-gray-900 mb-4">🔒 Identity & Security</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6">
              <li><strong>Cloud IAM</strong>: Identity and Access Management, equivalent to AWS IAM.</li>
              <li><strong>Secret Manager</strong>: Secure secrets storage, similar to AWS Secrets Manager.</li>
            </ul>
          </div>
        </section>

        {/* GitLab Section */}
        <section id="gitlab" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">GitLab</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-8">
              GitLab is a complete DevOps platform, delivered as a single application, from project planning and source code management to CI/CD, security, and monitoring.
            </p>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">⚙️ DevOps & CI/CD</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6">
              <li><strong>GitLab CI/CD</strong>: Comprehensive CI/CD pipelines, similar to AWS CodePipeline/CodeBuild.</li>
              <li><strong>Container Registry</strong>: Built-in Docker image registry, similar to AWS ECR.</li>
              <li><strong>Package Registry</strong>: Universal package manager, similar to AWS CodeArtifact.</li>
            </ul>

            <h3 className="text-2xl font-semibold text-gray-900 mb-4">🔒 Security & Compliance</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6">
              <li><strong>Security Scanning (SAST, DAST, Dependency Scanning)</strong>: Integrated security features.</li>
              <li><strong>Compliance Management</strong>: Tools for audit and compliance.</li>
            </ul>

            <h3 className="text-2xl font-semibold text-gray-900 mb-4">🔗 Project Management & Collaboration</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6">
              <li><strong>Issue Tracking & Boards</strong>: Project management features.</li>
              <li><strong>Version Control (Git)</strong>: Source code management.</li>
            </ul>
          </div>
        </section>
      </div>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Optimize Your Cloud Strategy?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Let&apos;s discuss how our cloud expertise can drive your business forward.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started Today
            </Link>
            <Link 
              href="/case-studies" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              View Our Case Studies
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
