import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import useSWR from 'swr';
import { INotionSearch, INotionSearchObject, NotionDatabase } from 'src/types/notion';
import config from 'site-config';
import { fetcher } from 'src/lib/swr';
import { useRouter } from 'next/router';
import { ChildDatabaseItem } from 'src/components/notion/lib/ChildDatabaseItem';
import { SearchForm } from 'src/components/search/SearchForm';
import { NotionClient } from 'lib/notion/Notion';

interface SearchResult {
  searchValue?: string;
  searchResult?: Array<INotionSearchObject>;
}

export default function Search({ searchValue, searchResult }: SearchResult) {
  return (
    <div className='w-full max-w-screen-lg px-5 m-auto my-6'>
      <div>
        <div className='max-w-screen-sm mt-4 mx-auto text-center'>
          <h1 className='text-2xl'>검색어를 입력해주세요.</h1>
          <div className='mt-10'>
            <SearchForm
              //! key로 리렌더링 강제유발
              key={`search-${new Date().getTime()}`}
              //! key로 리렌더링 강제유발
              searchValue={searchValue}
            />
          </div>
        </div>
        <div className='mt-10'>
          {Array.isArray(searchResult) && searchResult.length > 0 ? (
            <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
              {searchResult.map((search) => (
                <ChildDatabaseItem
                  key={`search-${search.id}`}
                  block={search as NotionDatabase}
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
  const result = await notionClient.getSearchPagesByPageTitle({
    filterType: 'page',
    searchValue: slug
  });

  return {
    props: {
      searchValue: slug,
      searchResult: result
    }
  };
};
