import Head from 'next/head';
import Link from 'next/link';
import { JobsDashboard } from '~/components/jobs-dashboard';

export default function JobsPage() {
  return (
    <>
      <Head>
        <title>Jobs Dashboard</title>
        <meta name="description" content="Monitor and manage pg-boss jobs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Navigation */}
          <nav className="mb-8">
            <div className="flex items-center space-x-4 text-sm">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                Home
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">Jobs Dashboard</span>
            </div>
          </nav>

          <JobsDashboard />
        </div>
      </main>
    </>
  );
}
