import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import BlogNav from '../../../components/blog-nav';
import type { BlogTagGroup } from '../../../lib/blog';
import { getAllBlogTagGroups } from '../../../lib/blog';

interface BlogTagsPageProps {
  groups: BlogTagGroup[];
}

const BlogTagsPage = ({ groups }: BlogTagsPageProps) => {
  return (
    <>
      <Head>
        <title>Tags | Blog</title>
        <meta name="description" content="Browse blog posts by tag" />
      </Head>

      <main className="min-h-screen bg-gray-100">
        <BlogNav />

        <section className="mx-auto w-full max-w-4xl px-6 pb-20 pt-8 md:px-10 md:pt-12">
          <h1 className="font-title-theme text-center text-7xl font-semibold leading-tight text-[#35373b] md:text-8xl">
            tags
          </h1>
          <div className="mx-auto mt-4 h-1.5 w-16 bg-[#35373b]" />

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {groups.map((group) => (
              <Link
                key={group.tagPath}
                href={`/blog/tags/${group.tagPath}`}
                className="rounded bg-gray-200 px-3 py-1 type-meta text-lg text-[#4b4d52] transition hover:bg-gray-300"
              >
                {group.tag}
              </Link>
            ))}
          </div>

          <div className="mt-12 space-y-12">
            {groups.map((group) => (
              <section key={group.tagPath}>
                <h2 className="font-title-theme text-5xl font-semibold text-[#35373b] md:text-6xl">
                  #{group.tag}
                </h2>

                <ul className="mt-5 space-y-4">
                  {group.posts.map((post) => (
                    <li key={`${group.tagPath}-${post.path}`}>
                      <Link href={`/blog/${post.path}`} className="grid grid-cols-1 gap-1 md:grid-cols-[1fr_auto] md:gap-4">
                        <span className="font-title-theme text-[2rem] leading-snug text-[#44464b]">
                          {post.title}
                        </span>
                        <time className="type-meta text-[1.7rem] text-[#9aa0a8]" dateTime={post.date}>
                          {post.date}
                        </time>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </section>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps<BlogTagsPageProps> = async () => {
  const groups = getAllBlogTagGroups();

  return {
    props: {
      groups,
    },
  };
};

export default BlogTagsPage;
