import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_POSTS_DIR = path.join(process.cwd(), 'pages/markdown/blog');
const BLOG_FILENAME_REGEX = /^y\d{2}m\d{1,2}w\d{1,2}d\d{1,2}-[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;

export interface BlogPost {
  path: string;
  title: string;
  date: string;
  tags: string[];
  normalizedTags: string[];
  excerpt: string;
  content: string;
  coverImage: string | null;
  coverImageAlt: string | null;
  dateValue: number;
}

export interface BlogPostSummary {
  path: string;
  title: string;
  date: string;
  tags: string[];
  normalizedTags: string[];
  excerpt: string;
  coverImage: string | null;
  coverImageAlt: string | null;
}

export interface BlogTagGroup {
  tag: string;
  tagPath: string;
  posts: BlogPostSummary[];
}

interface BlogFrontmatter {
  title?: unknown;
  date?: unknown;
  tags?: unknown;
  excerpt?: unknown;
  cover_image?: unknown;
  cover_image_alt?: unknown;
}

function validateFilename(fileName: string): void {
  if (!BLOG_FILENAME_REGEX.test(fileName)) {
    throw new Error(
      `Invalid blog filename \"${fileName}\". Use y<yy>m<m>w<w>d<d>-<title-kebab>.md`
    );
  }
}

function asRequiredString(value: unknown, field: string, fileName: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Missing required frontmatter \"${field}\" in ${fileName}`);
  }

  return value.trim();
}

function parseDate(rawDate: unknown, fileName: string): { isoDate: string; dateMs: number } {
  if (!rawDate) {
    throw new Error(`Missing required frontmatter \"date\" in ${fileName}`);
  }

  if (rawDate instanceof Date) {
    const dateMs = rawDate.getTime();

    if (Number.isNaN(dateMs)) {
      throw new Error(`Invalid date value in ${fileName}`);
    }

    return {
      isoDate: rawDate.toISOString().slice(0, 10),
      dateMs,
    };
  }

  if (typeof rawDate === 'string') {
    const trimmed = rawDate.trim();

    if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      throw new Error(
        `Invalid date \"${rawDate}\" in ${fileName}. Expected format: YYYY-MM-DD`
      );
    }

    const parsedDate = new Date(`${trimmed}T00:00:00Z`);

    if (Number.isNaN(parsedDate.getTime())) {
      throw new Error(`Invalid date \"${rawDate}\" in ${fileName}`);
    }

    return {
      isoDate: trimmed,
      dateMs: parsedDate.getTime(),
    };
  }

  throw new Error(`Invalid date value in ${fileName}. Use YYYY-MM-DD.`);
}

export function normalizeTag(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseTags(rawTags: unknown, fileName: string): { tags: string[]; normalizedTags: string[] } {
  if (!Array.isArray(rawTags) || rawTags.length === 0) {
    throw new Error(`Missing required frontmatter \"tags\" in ${fileName}`);
  }

  const seen = new Set<string>();
  const tags: string[] = [];
  const normalizedTags: string[] = [];

  rawTags.forEach((tagValue, index) => {
    if (typeof tagValue !== 'string' || tagValue.trim().length === 0) {
      throw new Error(`Invalid tag at index ${index} in ${fileName}. Tags must be non-empty strings.`);
    }

    const cleanedTag = tagValue.trim();
    const normalizedTag = normalizeTag(cleanedTag);

    if (!normalizedTag) {
      throw new Error(`Invalid tag \"${cleanedTag}\" in ${fileName}.`);
    }

    if (!seen.has(normalizedTag)) {
      seen.add(normalizedTag);
      tags.push(cleanedTag);
      normalizedTags.push(normalizedTag);
    }
  });

  if (normalizedTags.length === 0) {
    throw new Error(`At least one valid tag is required in ${fileName}`);
  }

  return { tags, normalizedTags };
}

function getPostFiles(): string[] {
  if (!fs.existsSync(BLOG_POSTS_DIR)) {
    return [];
  }

  return fs
    .readdirSync(BLOG_POSTS_DIR)
    .filter((fileName) => fileName.endsWith('.md'))
    .sort((a, b) => a.localeCompare(b));
}

function toSummary(post: BlogPost): BlogPostSummary {
  return {
    path: post.path,
    title: post.title,
    date: post.date,
    tags: post.tags,
    normalizedTags: post.normalizedTags,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    coverImageAlt: post.coverImageAlt,
  };
}

function parsePost(fileName: string): BlogPost {
  validateFilename(fileName);

  const filePath = path.join(BLOG_POSTS_DIR, fileName);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);
  const frontmatter = data as BlogFrontmatter;

  const title = asRequiredString(frontmatter.title, 'title', fileName);
  const excerpt = asRequiredString(frontmatter.excerpt, 'excerpt', fileName);
  const { isoDate, dateMs } = parseDate(frontmatter.date, fileName);
  const { tags, normalizedTags } = parseTags(frontmatter.tags, fileName);

  const coverImage =
    typeof frontmatter.cover_image === 'string' && frontmatter.cover_image.trim().length > 0
      ? frontmatter.cover_image.trim()
      : null;

  const coverImageAlt =
    typeof frontmatter.cover_image_alt === 'string' && frontmatter.cover_image_alt.trim().length > 0
      ? frontmatter.cover_image_alt.trim()
      : null;

  return {
    path: fileName.replace(/\.md$/, ''),
    title,
    date: isoDate,
    tags,
    normalizedTags,
    excerpt,
    content: content.trim(),
    coverImage,
    coverImageAlt,
    dateValue: dateMs,
  };
}

function sortByNewest(posts: BlogPost[]): BlogPost[] {
  return posts.sort((a, b) => {
    if (b.dateValue !== a.dateValue) {
      return b.dateValue - a.dateValue;
    }

    return a.path.localeCompare(b.path);
  });
}

export function getAllBlogPosts(): BlogPost[] {
  const files = getPostFiles();
  const posts = files.map(parsePost);

  return sortByNewest(posts);
}

export function getAllBlogPostSummaries(): BlogPostSummary[] {
  return getAllBlogPosts().map(toSummary);
}

export function getAllBlogPostPaths(): string[] {
  return getAllBlogPosts().map((post) => post.path);
}

export function getBlogPostByPath(postPath: string): BlogPost | null {
  const posts = getAllBlogPosts();
  const foundPost = posts.find((post) => post.path === postPath);

  return foundPost ?? null;
}

export function getAllBlogTagGroups(): BlogTagGroup[] {
  const posts = getAllBlogPostSummaries();
  const tagMap = new Map<string, BlogTagGroup>();

  posts.forEach((post) => {
    post.normalizedTags.forEach((normalizedTag, index) => {
      const existingGroup = tagMap.get(normalizedTag);
      const displayTag = post.tags[index] ?? normalizedTag;

      if (existingGroup) {
        existingGroup.posts.push(post);
        return;
      }

      tagMap.set(normalizedTag, {
        tag: displayTag,
        tagPath: normalizedTag,
        posts: [post],
      });
    });
  });

  return Array.from(tagMap.values()).sort((a, b) => a.tag.localeCompare(b.tag));
}

export function getPostsForTag(tagPath: string): BlogPostSummary[] {
  const normalizedTag = normalizeTag(tagPath);

  return getAllBlogPostSummaries().filter((post) => post.normalizedTags.includes(normalizedTag));
}
