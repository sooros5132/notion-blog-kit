/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

/**
 * Not Working in Deployed With Vercel.
 * `fs`, `path` does not work as intended.
 *
 * Vercel에서 배포하면 작동하지 않음.
 * `fs`, `path`가 의도한 대로 동작하지 않는다.
 *
 *
 */

const CACHE_PATH = path.resolve('./lib/notion/cache');

function cachePathMaker(blockId) {
  return path.join(CACHE_PATH, `${blockId.replaceAll('-', '')}.json`);
}

exports.get = function (blockId) {
  const cachePath = cachePathMaker(blockId);
  const parsedData = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
  if (process.env.NODE_ENV === 'development' && parsedData) {
    console.log(`get cached data ${blockId} into ${cachePath}`);
  }
  return parsedData;
};

exports.set = function (blockId, content) {
  const cachePath = cachePathMaker(blockId);
  const exist = fs.existsSync(CACHE_PATH);
  if (!exist) {
    fs.mkdir(CACHE_PATH, { recursive: true }, console.error);
  }

  fs.writeFileSync(cachePath, JSON.stringify(content), 'utf-8');
  return;
};

exports.exists = function (blockId) {
  const cachePath = cachePathMaker(blockId);
  return fs.existsSync(cachePath);
};

exports.expire = function (blockId) {
  const cachePath = cachePathMaker(blockId);
  console.log(`cache expire ${blockId} into ${cachePath}`);
  return fs.unlinkSync(cachePath);
};

// exports.expireAll = function () {
//   return fs.rmdirSync(CACHE_PATH, { recursive: true });
// };

// exports.setAllCache = function () {
//   const baseBlock = process.env.NEXT_PUBLIC_NOTION_BASE_BLOCK;
//   const cachePath = cachePathMaker(baseBlock);
//   const notionClient = new Notion.NotionClient();
//   fs.writeFileSync(cachePath, JSON.stringify(content));
// };
