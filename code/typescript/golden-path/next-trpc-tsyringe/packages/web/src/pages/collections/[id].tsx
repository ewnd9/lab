import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { api } from '~/utils/api';

export default function CollectionPage() {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: collection,
    isLoading,
    error,
  } = api.collections.getCollectionById.useQuery({ id: id as string }, { enabled: !!id });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] flex items-center justify-center">
        <div className="text-center">
          <div className="rounded-lg bg-red-500/20 border border-red-500/50 p-6 text-red-300">
            <h2 className="text-xl font-semibold mb-2">Error loading collection</h2>
            <p className="text-sm">{error.message}</p>
            <Link
              href="/"
              className="inline-block mt-4 px-4 py-2 bg-red-500/30 hover:bg-red-500/50 rounded-md transition-colors"
            >
              ← Back to Collections
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] flex items-center justify-center">
        <div className="text-center">
          <div className="rounded-lg bg-gray-500/20 border border-gray-500/50 p-6">
            <h2 className="text-xl font-semibold text-white mb-2">Collection not found</h2>
            <p className="text-gray-400 mb-4">The requested collection could not be found.</p>
            <Link
              href="/"
              className="inline-block px-4 py-2 bg-gray-500/30 hover:bg-gray-500/50 rounded-md transition-colors text-white"
            >
              ← Back to Collections
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{collection.name} - Instagram Collection</title>
        <meta name="description" content={`View posts from ${collection.name} collection by @${collection.user}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Collections
            </Link>

            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-2xl">
                  {collection.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-4xl font-extrabold text-white">{collection.name}</h1>
                  <p className="text-lg text-gray-400 mt-1">@{collection.user}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {collection.posts.length} post{collection.posts.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <Link
                href={collection.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg text-blue-300 transition-colors"
              >
                <span>View on Instagram</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>

            <div className="mt-4 text-sm text-gray-400">
              <p>Created: {formatDate(collection.createdAt)}</p>
              {collection.updatedAt && <p>Updated: {formatDate(collection.updatedAt)}</p>}
            </div>
          </div>

          {/* Posts Grid */}
          {collection.posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="rounded-lg bg-gray-500/20 border border-gray-500/50 p-8">
                <h3 className="text-xl font-semibold text-white mb-2">No posts found</h3>
                <p className="text-gray-400">This collection doesn't contain any posts yet.</p>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Posts ({collection.posts.length})</h2>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {collection.posts.map((post) => (
                  <div
                    key={post.id}
                    className="group relative rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-200"
                  >
                    {/* Media Content */}
                    <div className="relative aspect-square bg-gray-800">
                      {post.videoUrl ? (
                        <video
                          className="w-full h-full object-cover"
                          poster={
                            `${process.env.NEXT_PUBLIC_AWS_BUCKET_PROXY_URL}/${post.thumbnailSrc}` ||
                            `${process.env.NEXT_PUBLIC_AWS_BUCKET_PROXY_URL}/${post.displayUrl}` ||
                            undefined
                          }
                          controls
                          preload="metadata"
                        >
                          <source
                            src={`${process.env.NEXT_PUBLIC_AWS_BUCKET_PROXY_URL}/${post.videoUrl}`}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      ) : post.displayUrl ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_AWS_BUCKET_PROXY_URL}/${post.displayUrl}`}
                          alt="Instagram post"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}

                      {/* Video indicator */}
                      {post.videoUrl && (
                        <div className="absolute top-3 right-3 bg-black/60 rounded-full p-1">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Post Content */}
                    <div className="p-4">
                      {/* Author */}
                      {post.profile && (
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                            {post.profile.username?.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm text-gray-300 font-medium">@{post.profile.username}</span>
                        </div>
                      )}

                      {/* Description */}
                      {post.description && (
                        <p className="text-sm text-gray-400 mb-3 line-clamp-3">{post.description}</p>
                      )}

                      {/* Post Details */}
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          {post.parsedAt ? formatDate(post.parsedAt) : formatDate(post.createdAt)}
                        </div>
                        <Link
                          href={post.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
                              clipRule="evenodd"
                            />
                            <path
                              fillRule="evenodd"
                              d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
