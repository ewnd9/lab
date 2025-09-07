import Head from 'next/head';
import Link from 'next/link';
import CollectionCard from '~/components/collection-card';
import { api } from '~/utils/api';

export default function Home() {
  const { data: collections, isLoading, error } = api.collections.getAllCollections.useQuery();

  return (
    <>
      <Head>
        <title>Instagram Collections</title>
        <meta name="description" content="View your saved Instagram collections" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
              Instagram <span className="text-[hsl(280,100%,70%)]">Collections</span>
            </h1>
            <p className="mt-4 text-xl text-gray-300">Browse your saved Instagram posts organized by collection</p>
            <div className="mt-6">
              <Link
                href="/jobs"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                View Jobs Dashboard
              </Link>
            </div>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          )}

          {error && (
            <div className="text-center">
              <div className="rounded-lg bg-red-500/20 border border-red-500/50 p-4 text-red-300">
                <h3 className="text-lg font-semibold mb-2">Error loading collections</h3>
                <p className="text-sm">{error.message}</p>
              </div>
            </div>
          )}

          {collections && collections.length === 0 && (
            <div className="text-center">
              <div className="rounded-lg bg-gray-500/20 border border-gray-500/50 p-8">
                <h3 className="text-xl font-semibold text-white mb-2">No collections found</h3>
                <p className="text-gray-400 mb-4">Upload your Instagram collections data using the CLI tool</p>
                <div className="bg-black/30 rounded-md p-3 text-left text-sm font-mono text-green-300">
                  <div>$ yarn cli:upload</div>
                </div>
              </div>
            </div>
          )}

          {collections && collections.length > 0 && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-lg text-gray-300">
                  Found {collections.length} collection{collections.length !== 1 ? 's' : ''}
                </p>
                <div className="text-sm text-gray-400">
                  Total posts: {collections.reduce((sum, c) => sum + c.posts.length, 0)}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {collections.map((collection) => (
                  <CollectionCard key={collection.id} collection={collection} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
