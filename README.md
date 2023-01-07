# Notion Api Blog Kit
A statically generated blog using Next.js, Notion Api.

[example - blog.sooros.com](https://blog.sooros.com/)

## Deploy

### Vercel Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsooros5132%2Fnotion-blog-kit&env=NEXT_PUBLIC_INFOMATION_NICKNAME,NEXT_PUBLIC_NOTION_BASE_BLOCK,NOTION_API_SECRET_KEY&demo-title=Notion%20Blog&demo-description=A%20statically%20generated%20blog%20example%20using%20Next.js%2C%20Notion%20Api.&demo-url=https%3A%2F%2Fblog.sooros.com)

### env settings
*`Key` is required
|Key|Value|
|------|---|
|*`NOTION_API_SECRET_KEY`|ex) `secret_zhL...`|
|*`NEXT_PUBLIC_BASE_ORIGIN`|ex) `https://blog.sooros.com`|
|*`NEXT_PUBLIC_NOTION_BASE_BLOCK`|ex) `cd9c83dd9ea14181854cced99bac68c6`|
|*`NEXT_PUBLIC_INFOMATION_NICKNAME`|ex) `sooros`|
|`NEXT_PUBLIC_INFOMATION_EMAIL`|ex) `contact@sooros.com`|
|`NEXT_PUBLIC_INFOMATION_GITHUB`|ex) `https://github.com/sooros5132`|
|`NEXT_PUBLIC_INFOMATION_REPOSITORY`|ex) `https://github.com/sooros5132/soolog`|
|`NEXT_PUBLIC_NOTION_CUSTOM_DOMAIN`|[docs) notion.site domain setting](https://www.notion.so/ko-kr/blog/personalize-public-pages)<br />ex) `sooros`|
|`NEXT_PUBLIC_HEADER_MENU`| The page movement button (page, databases) displayed in nav.<br />Separate with commas(`,`).<br />`name1,pageId1,name2,pageId2,name3,pageId3,...`<br />ex) `category,dec967958ca74abeb493942f923100f7`|
|`NEXT_PUBLIC_GOOGLE_G_TAG`|google analytics tag<br />ex) `G-ER...`|
