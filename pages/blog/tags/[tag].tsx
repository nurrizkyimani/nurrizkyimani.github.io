import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import BlogNav from '../../../components/blog-nav';
import type { BlogPostSummary } from '../../../lib/blog';
import { getAllBlogTagGroups, getPostsForTag, normalizeTag } from '../../../lib/blog';
import { formatBlogDate } from '../../../lib/blog-client';

interface BlogTagDetailPageProps {
  tag: string;
  tagPath: string;
  posts: BlogPostSummary[];
}

const BlogTagDetailPage = ({ tag, tagPath, posts }: BlogTagDetailPageProps) => {
  return (
    <>
      <Head>
        <title>{`${tag} | Blog Tags`}</title>
        <meta name="description" content={`Posts tagged with ${tag}`} />
      </Head>

      <main className="min-h-screen bg-gray-100">
        <BlogNav />

        <section className="mx-auto w-full max-w-4xl px-6 pb-20 pt-8 md:px-10 md:pt-12">
          <p className="type-meta text-lg text-[#8f9398]">Tag</p>
          <h1 className="font-title-theme mt-2 text-7xl font-semibold text-[#35373b] md:text-8xl">#{tag}</h1>
          <div className="mt-4 h-1.5 w-16 bg-[#35373b]" />

          <p className="type-meta mt-4 text-lg text-[#8f9398]">{posts.length} posts</p>

          <ul className="mt-10 space-y-9">
            {posts.map((post) => (
              <li key={`${tagPath}-${post.path}`} className="border-b border-gray-300 pb-8">
                <time className="type-meta text-lg text-[#8f9398]" dateTime={post.date}>
                  {formatBlogDate(post.date)}
                </time>
                <Link href={`/blog/${post.path}`}>
                  <h2 className="font-title-theme mt-2 text-4xl font-semibold leading-tight text-[#35373b] md:text-5xl">
                    {post.title}
                  </h2>
                </Link>
                <div className="mt-3 h-1 w-12 bg-[#35373b]" />
                <p className="mt-4 reading-width type-body text-[1.8rem] text-[#4b4d52] md:text-[1.95rem]">
                  {post.excerpt}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllBlogTagGroups().map((group) => ({
    params: {
      tag: group.tagPath,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<BlogTagDetailPageProps> = async ({ params }) => {
  const rawTag = typeof params?.tag === 'string' ? params.tag : '';
  const tagPath = normalizeTag(rawTag);
  const groups = getAllBlogTagGroups();
  const group = groups.find((entry) => entry.tagPath === tagPath);

  if (!group) {
    return {
      notFound: true,
    };
  }

  const posts = getPostsForTag(tagPath);

  return {
    props: {
      tag: group.tag,
      tagPath,
      posts,
    },
  };
};

export default BlogTagDetailPage;
