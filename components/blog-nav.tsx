import Link from 'next/link';

const BlogNav = () => {
  return (
    <nav className="border-b border-gray-300">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-5 md:px-10">
        <Link href="/blog" className="font-title-theme text-3xl font-semibold tracking-tight text-[#3a3c40]">
          imani
        </Link>

        <ul className="flex items-center gap-8">
          <li>
            <Link href="/blog/tags" className="type-meta text-lg text-[#595d63] transition hover:text-[#2f2f2f]">
              tags
            </Link>
          </li>
          <li>
            <Link href="/#about" className="type-meta text-lg text-[#979ca3] transition hover:text-[#595d63]">
              about
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default BlogNav;
