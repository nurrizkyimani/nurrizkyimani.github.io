import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import BlogNav from '../../components/blog-nav';
import type { BlogPost } from '../../lib/blog';
import { getAllBlogPostPaths, getBlogPostByPath } from '../../lib/blog';
import { formatBlogDate } from '../../lib/blog-client';

interface BlogPostProps {
  post: BlogPost;
}

const BlogPostPage = ({ post }: BlogPostProps) => {
  return (
    <>
      <Head>
        <title>{`${post.title} | Blog`}</title>
        <meta name="description" content={post.excerpt} />
      </Head>

      <main className="min-h-screen bg-gray-100">
        <BlogNav />

        <article className="mx-auto w-full max-w-4xl px-6 pb-16 pt-8 md:px-10 md:pt-10">
          <p className="type-meta text-lg italic text-[#8f9398]">
            Published on <time dateTime={post.date}>{formatBlogDate(post.date)}</time>
          </p>

          <h1 className="font-title-theme mt-5 text-5xl font-semibold leading-tight text-[#35373b] md:text-7xl">
            {post.title}
          </h1>

          <div className="mt-4 h-1.5 w-16 bg-[#35373b]" />

          {post.coverImage && (
            <img
              className="mt-10 w-full rounded-sm border border-gray-300 object-cover"
              src={post.coverImage}
              alt={post.coverImageAlt ?? post.title}
            />
          )}

          <div className="blog-content mt-10">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <Link
                key={`${post.path}-${tag}`}
                href={`/blog/tags/${post.normalizedTags[index]}`}
                className="rounded bg-gray-200 px-3 py-1 type-meta text-base text-[#4b4d52] transition hover:bg-gray-300"
              >
                {tag}
              </Link>
            ))}
          </div>
        </article>
      </main>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllBlogPostPaths().map((postPath) => ({
    params: {
      post: postPath,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<BlogPostProps> = async ({ params }) => {
  const postPath = typeof params?.post === 'string' ? params.post : '';
  const post = getBlogPostByPath(postPath);

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
  };
};

export default BlogPostPage;
