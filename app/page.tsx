import Link from 'next/link';

async function getPosts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/posts`,
      { 
        cache: 'no-store',
        next: { revalidate: 0 }
      }
    );
    
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-5xl mx-auto px-6 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6 tracking-tight">
              My Blog
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Thoughts, stories and ideas about technology, design, and life
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </div>

      {/* Posts Section */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md mx-auto border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No posts yet</h3>
              <p className="text-gray-600 mb-6">
                Start creating amazing content in your admin panel!
              </p>
              <a 
                href="https://admin.mehrdm.me" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                Go to Admin Panel
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        ) : (
          <div className="grid gap-8">
            {posts.map((post, index) => (
              <article 
                key={post._id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-purple-200 animate-[fadeInUp_0.6s_ease-out_both]"
                // style={{ 
                //   animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                // }}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {post.title.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  
                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                      {post.title}
                    </h2>
                  </Link>
                  
                  <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:gap-4 transition-all duration-300 group/link"
                  >
                    <span>Read full article</span>
                    <svg className="w-5 h-5 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-20 py-12 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-gray-600">
            © {new Date().getFullYear()} My Blog. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
