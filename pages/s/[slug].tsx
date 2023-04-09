import React from 'react';
import { GetServerSideProps } from 'next';
import { BlogProperties, NotionPagesRetrieve, NotionSearch } from 'src/types/notion';
import { ChildDatabaseItem } from 'src/components/notion/lib/ChildDatabaseItem';
import { SearchForm } from 'src/components/search/SearchForm';
import { NotionClient } from 'lib/notion/Notion';

interface SearchResult {
  searchValue?: string;
  searchResult?: NotionSearch['results'];
  blogProperties?: BlogProperties;
}

export default function Search({ searchValue, searchResult }: SearchResult) {
  return (
    <div className='w-full max-w-[var(--article-max-width)] m-auto my-6 px-3'>
      <div>
        <div className='max-w-screen-sm mt-4 mx-auto text-center'>
          <h1 className='text-2xl'>검색어를 입력해주세요.</h1>
          <div className='mt-10'>
            <SearchForm key={searchValue} searchValue={searchValue} autoFocus />
          </div>
        </div>
        <div className='mt-10'>
          {Array.isArray(searchResult) && searchResult.length > 0 ? (
            <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
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
  );
}

export const getServerSideProps: GetServerSideProps<SearchResult> = async ({ query, params }) => {
  const slug = params?.slug;

  if (typeof slug !== 'string') {
    return {
      props: {
        searchValue: ''
      }
    };
  }

  const notionClient = new NotionClient();
  const [databaseResult, workspaceResult, blogProperties] = await Promise.all([
    notionClient.getSearchPagesByDatabase({
      direction: 'descending',
      searchValue: slug
    }),
    notionClient.getSearchPagesByWorkspace({
      direction: 'descending',
      // filter: 'page',
      searchValue: slug
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
    props: {
      blogProperties,
      searchValue: slug,
      searchResult: result
    }
  };
};
