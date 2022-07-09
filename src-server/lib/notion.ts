import { Client, LogLevel } from '@notionhq/client';
import config from 'site-setting';

export const notion = new Client({
  auth: config.notion.secretKey,
  logLevel: process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : undefined
});
