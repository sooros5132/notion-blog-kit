import { Client, LogLevel } from '@notionhq/client';
import { NOTION_API_SECRET_KEY } from './constants';

export const notion = new Client({
  auth: NOTION_API_SECRET_KEY,
  logLevel: process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : undefined
});
