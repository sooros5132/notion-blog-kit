import { BlogProperties, NotionPagesRetrieve, NotionSearch } from '@/types/notion';
import { ChildDatabaseItem } from '@/components/notion/lib/ChildDatabaseItem';
import { SearchForm } from '@/components/search/SearchForm';
import { NotionClient } from '@/server/notion/Notion';
import { NotionStoreProvider, useNotionStore } from '@/store/notion';
import { redirect } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import { siteConfig } from '@/lib/site-config';

export const dynamic = 'force-dynamic';

interface SearchResult {
  redirect?: string;
  searchValue?: string;
  searchResult?: NotionSearch['results'];
  blogProperties?: BlogProperties;
}

type SearchParams = { params: { slug: string } };

export default async function Search({ params }: SearchParams) {
  const { slug: title } = params;
  const result = await searchTitle(decodeURIComponent(title));
  const { searchResult, blogProperties } = result;

  if (result.redirect) {
    redirect(result.redirect);
  }

  return (
    <NotionStoreProvider store={{ blogProperties }}>
      <div className='w-full max-w-article m-auto my-6 px-3'>
        <div>
          <div className='max-w-screen-sm mt-4 mx-auto text-center'>
            <h1 className='text-2xl'>검색어를 입력해주세요.</h1>
            <div className='mt-10'>
              <SearchForm key={title} searchValue={title} autoFocus />
            </div>
          </div>
          <div className='mt-10'>
            {Array.isArray(searchResult) && searchResult.length > 0 ? (
              <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
                {searchResult.map((search) => (
                  <ChildDatabaseItem
                    key={`search-${search.id}`}
                    block={search as NotionPagesRetrieve}
                    sortKey={'created_time'}
                  />
                ))}
              </div>
            ) : (
              <div className='text-center'>검색 결과가 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    </NotionStoreProvider>
  );
}

async function searchTitle(title: string): Promise<SearchResult> {
  if (typeof title !== 'string') {
    return { redirect: '/' };
  }

  const notionClient = new NotionClient();
  const [databaseResult, workspaceResult, blogProperties] = await Promise.all([
    notionClient.getSearchPagesByDatabase({
      direction: 'descending',
      searchValue: title
    }),
    notionClient.getSearchPagesByWorkspace({
      direction: 'descending',
      // filter: 'page',
      searchValue: title
    }),
    notionClient.getBlogProperties()
  ]);

  const resultRecord: Record<string, NotionSearch['results'][number]> = {};

  for (const database of databaseResult) {
    resultRecord[database.id] = database;
  }
  for (const workspace of workspaceResult) {
    resultRecord[workspace.id] = workspace;
  }
  const result: NotionSearch['results'] = Object.values(resultRecord);

  return {
    blogProperties,
    searchValue: title,
    searchResult: result
  };
}

export async function generateMetadata(
  { params }: SearchParams,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const parent = await _parent;
  const slug = decodeURIComponent(params.slug);
  return {
    title: `${slug} - ${siteConfig.infomation.blogname || ''}`
  };
}
