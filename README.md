# ![favicon-32x32](https://user-images.githubusercontent.com/74892930/230014114-ddbb901a-9cc6-4607-942b-0de153536ac5.png) Notion Blog Web UI Kit
A statically generated blog using [Next.js](https://github.com/vercel/next.js/), [Notion Api](https://github.com/makenotion/notion-sdk-js).

## Live Demo
[https://notion-blog-kit-demo.vercel.app](https://notion-blog-kit-demo.vercel.app)

## Screenshot
| Magagin | Archive | Article | 
|--|--|--|
| <img alt="magagin" src="https://github.com/sooros5132/notion-blog-kit/assets/74892930/3b0b9ec4-bf26-4b0a-aca8-995482a4e7e9"> | <img alt="archive" src="https://github.com/sooros5132/notion-blog-kit/assets/74892930/b5d91818-bc67-43f6-822e-81f9d4b0b918"> | <img alt="article" src="https://github.com/sooros5132/notion-blog-kit/assets/74892930/46633aac-1c21-499b-a40b-17713537090c"> |

## Support Blocks
[https://notion-blog-kit-demo.vercel.app/supported-notion-blocks](https://notion-blog-kit-demo.vercel.app/supported-notion-blocks)
<br />

## Getting Started
[View images and detailed descriptions in live demo](https://notion-blog-kit-demo.vercel.app/notion-blog-kit-deploy-step)
1. Star this repo⭐️
2. [Create notion integrations secret token](https://www.notion.so/my-integrations), Please check read only access and remember secret token.
3. Go to the page you want to share and connection to the name of the integration
4. [Deploy with Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsooros5132%2Fnotion-blog-kit&env=NOTION_API_SECRET_KEY,NEXT_PUBLIC_NOTION_DATABASE_ID,NEXT_PUBLIC_INFOMATION_BLOGNAME) or Your server (Vercel is free if a [hobby](https://vercel.com/pricing).)
5. Create `/.env` file and according to the table below (`Deploy with Vercel` has already been set above.)
<br />

## 🗒️Environment Variables
Create `/.env` file and according to the table below or refrence `/.env.example`

|Key (`*` is required)|Value|
|------|---|
|*`NOTION_API_SECRET_KEY`|[Create notion integration `secret token`](https://www.notion.so/my-integrations)<br />please check read only access<br />ex) `secret_zhL...`|
|*`NEXT_PUBLIC_NOTION_DATABASE_ID`|ex) `cd9c83dd...`|
|*`NEXT_PUBLIC_INFOMATION_BLOGNAME`|ex) `soolog`|
|*`NEXT_PUBLIC_INFOMATION_ORIGIN`|ex) `https://example.com`|
|`NEXT_PUBLIC_INFOMATION_EMAIL`|ex) `contact@sooros.com`|
|`NEXT_PUBLIC_INFOMATION_GITHUB`|ex) `https://github.com/sooros5132`|
|`NEXT_PUBLIC_INFOMATION_REPOSITORY`|ex) `https://github.com/sooros5132/notion-blog-kit`|
|`NEXT_PUBLIC_NOTION_CUSTOM_DOMAIN`|[docs) notion.site domain setting](https://www.notion.so/ko-kr/blog/personalize-public-pages)<br />recommend setting this variable.<br />ex) `sooros`|
|`NEXT_PUBLIC_GOOGLE_G_TAG`|google analytics tag<br />ex) `G-ER...`|
|`NEXT_PUBLIC_ENABLE_IMAGE_OPTIMIZATION`|This function has the effect of being reflected in the Google search ranking. For fast processing, this feature requires server performance as high as Intel Pentium.|
<br />

## Deploy with Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-name=notion-blog-kit&repository-url=https%3A%2F%2Fgithub.com%2Fsooros5132%2Fnotion-blog-kit&project-name=Notion+Blog+Kit&env=NOTION_API_SECRET_KEY,NEXT_PUBLIC_NOTION_DATABASE_ID,NEXT_PUBLIC_INFOMATION_BLOGNAME,NEXT_PUBLIC_INFOMATION_ORIGIN&envLink=https%3A%2F%2Fgithub.com%2Fsooros5132%2Fnotion-blog-kit%2Fblob%2Fmain%2F.env.example)