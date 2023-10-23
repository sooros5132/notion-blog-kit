import path from 'path';
import { promises as fs } from 'fs';

/**
 * Caching folder path is `[project root]/lib/notion/cache`
 *
 * Using the `/tmp` folder in Vercel.
 * project folder will be read only.
 *
 * Vercel에서는 `/tmp` 폴더 사용.
 * project 폴더가 read only로 된다.
 */
export const CACHE_PATH =
  process.env.VERCEL === '1'
    ? path.join('/tmp', 'notion-blog-kit', 'notion', 'cache')
    : path.join(process.cwd(), 'src', 'server', 'notion', 'cache');

function cachePathMaker(blockId: string) {
  return path.join(CACHE_PATH, `${blockId.replaceAll('-', '')}.json`);
}

export async function get<T>(blockId: string) {
  try {
    const cachePath = cachePathMaker(blockId);
    const content = await fs.readFile(cachePath, 'utf-8');
    const parsedData = JSON.parse(content);

    if (process.env.DEBUG_LOGS && parsedData) {
      console.log('\x1b[37m\x1b[42m');
      console.log(`from cache data \`${blockId}\``, '\x1b[0m');
    }

    return parsedData as T;
  } catch (e) {
    return;
  }
}

export async function set(blockId: string, content: any) {
  try {
    const cachePath = cachePathMaker(blockId);

    try {
      await fs.access(cachePath, fs.constants.R_OK | fs.constants.W_OK);
    } catch (e) {
      await fs.mkdir(CACHE_PATH, { recursive: true });
    }

    await fs.writeFile(cachePath, JSON.stringify(content), 'utf-8');
    if (process.env.DEBUG_LOGS) {
      console.log('\x1b[37m\x1b[42m');
      console.log(`set cache \`${blockId}\` into \`${cachePath}\``, '\x1b[0m');
    }
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function accessCache(blockId: string) {
  const cachePath = cachePathMaker(blockId);

  try {
    await fs.access(cachePath, (fs.constants || fs).R_OK);
    return true;
  } catch (e) {
    return false;
  }
}

export async function deleteCache(blockId: string) {
  const cachePath = cachePathMaker(blockId);

  try {
    await fs.unlink(cachePath);
    if (process.env.DEBUG_LOGS) {
      console.log('\x1b[37m\x1b[42m');
      console.log(`delete cache \`${blockId}\` into \`${cachePath}\``, '\x1b[0m');
    }
    return true;
  } catch (e) {
    return false;
  }
}

export async function deleteCacheDirectory() {
  if (path.resolve(CACHE_PATH) === '/') {
    return false;
  }

  try {
    await fs.rm(CACHE_PATH, { recursive: true, force: true, maxRetries: 1 });
    return true;
  } catch (e) {
    return false;
  }
}

// exports.expireAll = function () {
//   return fs.rmdirSync(CACHE_PATH, { recursive: true });
// };

// exports.setAllCache = function () {
//   const baseBlock = process.env.NEXT_PUBLIC_NOTION_DATABASE_ID;
//   const cachePath = cachePathMaker(baseBlock);
//   const notionClient = new Notion.NotionClient();
//   fs.writeFileSync(cachePath, JSON.stringify(content));
// };
