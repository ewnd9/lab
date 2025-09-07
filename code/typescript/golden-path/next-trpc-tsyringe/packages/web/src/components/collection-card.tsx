import Link from 'next/link';

interface Post {
  id: string;
  url: string;
  createdAt: Date;
}

interface Collection {
  id: string;
  user: string;
  name: string;
  url: string;
  createdAt: Date;
  updatedAt: Date | null;
  posts: Post[];
}

interface CollectionCardProps {
  collection: Collection;
}

export default function CollectionCard({ collection }: CollectionCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  return (
    <div className="group relative rounded-lg bg-white/5 p-6 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
            {collection.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
              {collection.name}
            </h3>
            <p className="text-sm text-gray-400">@{collection.user}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-medium text-blue-300">
            {collection.posts.length} posts
          </span>
          <Link
            href={collection.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-gray-400 hover:text-white transition-colors z-10 relative"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
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

      <div className="mb-4">
        <p className="text-sm text-gray-400">
          Created: {formatDate(collection.createdAt)}
          {collection.updatedAt && <span> • Updated: {formatDate(collection.updatedAt)}</span>}
        </p>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-300">
        <span>Click to view all posts</span>
        <svg
          className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>

      {/* Full card clickable link */}
      <Link href={`/collections/${collection.id}`} className="absolute inset-0 rounded-lg">
        <span className="sr-only">View {collection.name} collection</span>
      </Link>
    </div>
  );
}
