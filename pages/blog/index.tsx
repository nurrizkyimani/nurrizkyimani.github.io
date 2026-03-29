import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import BlogNav from '../../components/blog-nav';
import type { BlogPostSummary } from '../../lib/blog';
import { getAllBlogPostSummaries } from '../../lib/blog';
import { formatBlogDate } from '../../lib/blog-client';

interface BlogIndexProps {
  posts: BlogPostSummary[];
}

const INITIAL_VISIBLE_POSTS = 5;
const POSTS_PER_BATCH = 5;

const BlogIndexPage = ({ posts }: BlogIndexProps) => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_POSTS);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const hasMorePosts = visibleCount < posts.length;
  const visiblePosts = useMemo(() => posts.slice(0, visibleCount), [posts, visibleCount]);

  useEffect(() => {
    if (!hasMorePosts || !loadMoreRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCount((currentCount) => Math.min(currentCount + POSTS_PER_BATCH, posts.length));
          }
        });
      },
      {
        rootMargin: '140px 0px',
      }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasMorePosts, posts.length]);

  return (
    <>
      <Head>
        <title>Blog | Nurrizky Imani</title>
        <meta name="description" content="Markdown blog posts by Nurrizky Imani" />
      </Head>

      <main className="min-h-screen bg-gray-100">
        <BlogNav />

        <section className="mx-auto w-full max-w-4xl px-6 pb-20 pt-8 md:px-10 md:pt-12">
          {visiblePosts.length === 0 && (
            <div className="rounded-md border border-gray-300 bg-white px-6 py-7">
              <p className="type-body">No posts yet. Add markdown files to `pages/markdown/blog/`.</p>
            </div>
          )}

          <ul className="space-y-12 md:space-y-14">
            {visiblePosts.map((post) => (
              <li key={post.path} className="border-b border-gray-300 pb-12 md:pb-14">
                <time className="type-meta text-base text-[#8f9398]" dateTime={post.date}>
                  {formatBlogDate(post.date)}
                </time>

                <Link href={`/blog/${post.path}`} className="mt-3 block">
                  <h2 className="font-title-theme text-3xl font-semibold leading-tight text-[#35373b] md:text-4xl">
                    {post.title}
                  </h2>
                </Link>

                <div className="mt-3 h-1 w-12 bg-[#35373b]" />

                <p className="mt-4 max-w-3xl font-body-theme text-[1.1rem] leading-8 text-[#4b4d52] md:text-[1.22rem]">
                  {post.excerpt}
                </p>
              </li>
            ))}
          </ul>

          <div ref={loadMoreRef} className="h-10 w-full" />

          {!hasMorePosts && posts.length > 0 && (
            <p className="type-meta mt-4 text-center text-[#8f9398]">You reached the latest archive boundary.</p>
          )}
        </section>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps<BlogIndexProps> = async () => {
  const posts = getAllBlogPostSummaries();

  return {
    props: {
      posts,
    },
  };
};

export default BlogIndexPage;
