# Notion Blog Starter Kit
A statically generated blog using [Next.js](https://github.com/vercel/next.js/), [Notion Api](https://github.com/makenotion/notion-sdk-js).

## Live Demo
[https://notion-blog-kit-demo.vercel.app/](https://notion-blog-kit-demo.vercel.app/)

## ⚡️Getting Started
[View images and detailed descriptions in live demo](https://notion-blog-kit-demo.vercel.app/Notion%20blog%20kit%20deploying%20step-51017154b8ad43188eb5994dd594b1c6)
1. Star this repo⭐️ 😉
2. [Create notion integrations secret token](https://www.notion.so/my-integrations), Please check read only access and remember secret token.
3. Go to the page you want to share and connection to the name of the integration
4. [Deploy with Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsooros5132%2Fnotion-blog-kit&env=NOTION_API_SECRET_KEY,NEXT_PUBLIC_NOTION_BASE_BLOCK,NEXT_PUBLIC_INFOMATION_BLOGNAME&demo-title=My%20Notion%20Blog&demo-description=A%20statically%20generated%20blog%20using%20Next.js%2C%20Notion%20Api.&demo-url=https%3A%2F%2Fblog.sooros.com) or Your server (Vercel is free if a [hobby](https://vercel.com/pricing).)
5. Create `/.env` file and according to the table below (`Deploy with Vercel` has already been set above.)

## 🗒️Environment Variables
Create `/.env` file and according to the table below or refrence `/.env.sample`

|Key (`*` is required)|Value|
|------|---|
|*`NOTION_API_SECRET_KEY`|[Create notion integration `secret token`](https://www.notion.so/my-integrations)<br />please check read only access<br />ex) `secret_zhL...`|
|*`NEXT_PUBLIC_NOTION_BASE_BLOCK`|ex) `cd9c83dd9ea14181854cced99bac68c6`|
|*`NEXT_PUBLIC_INFOMATION_BLOGNAME`|ex) `soolog`|
|`NEXT_PUBLIC_INFOMATION_EMAIL`|ex) `contact@sooros.com`|
|`NEXT_PUBLIC_INFOMATION_GITHUB`|ex) `https://github.com/sooros5132`|
|`NEXT_PUBLIC_INFOMATION_REPOSITORY`|ex) `https://github.com/sooros5132/notion-blog-kit`|
|`NEXT_PUBLIC_NOTION_CUSTOM_DOMAIN`|[docs) notion.site domain setting](https://www.notion.so/ko-kr/blog/personalize-public-pages)<br />recommend setting this variable.<br />ex) `sooros`|
|`NEXT_PUBLIC_HEADER_MENU`| The page movement button (page, databases) displayed in nav.<br />Separate with commas(`,`).<br />`name1,pageId1,name2,pageId2,name3,pageId3,...`<br />ex) `category,dec967958ca74abeb493942f923100f7`|
|`NEXT_PUBLIC_GOOGLE_G_TAG`|google analytics tag<br />ex) `G-ER...`|

## Deploy with Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsooros5132%2Fnotion-blog-kit&env=NOTION_API_SECRET_KEY,NEXT_PUBLIC_NOTION_BASE_BLOCK,NEXT_PUBLIC_INFOMATION_BLOGNAME&demo-title=My%20Notion%20Blog&demo-description=A%20statically%20generated%20blog%20using%20Next.js%2C%20Notion%20Api.&demo-url=https%3A%2F%2Fblog.sooros.com)