import React from 'react';
import { NextPage } from 'next';
import useSWR from 'swr';
import { INotionSearch, NotionDatabase } from 'src/types/notion';
import config from 'site-config';
import { fetcher } from 'src/lib/swr';
import { useRouter } from 'next/router';
import { ChildDatabaseBlock } from 'src/components/notion/ChildDatabase';
import Search from 'src/components/search/Search';

const SearchValue: NextPage = (): JSX.Element => {
  const router = useRouter();

  return (
    <div className='w-full max-w-screen-lg px-5 m-auto my-6'>
      {router.isReady ? (
        <div>
          <div className='mt-4 text-center'>
            <h1 className='text-2xl'>검색어를 입력해주세요.</h1>
            <div className='mt-10'>
              <Search
                //! key로 리렌더링 강제유발
                key={`search-${new Date().getTime()}`}
                //! key로 리렌더링 강제유발
                searchValue={router.query.search as string}
              />
            </div>
          </div>
          <Searching />
        </div>
      ) : (
        <div className='mt-10 text-cetner'>로딩 중</div>
      )}
    </div>
  );
};
SearchValue.displayName = 'SearchValue';

const Searching: React.FC = () => {
  const router = useRouter();
  const { data, error, isValidating } = useSWR<INotionSearch['results']>(
    `${config.path}/notion/search/value/${encodeURIComponent(
      (router.query.search as string) || ''
    )}?filterType=page`,
    fetcher,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false
    }
  );

  if (isValidating) {
    return <div className='mt-10 text-center'>검색 중</div>;
  }

  return (
    <div className='mt-10'>
      {Array.isArray(data) && data.length > 0 ? (
        <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
          {data.map((search) => (
            <div key={`search-${search.id}`}>
              <ChildDatabaseBlock block={search as NotionDatabase} />
            </div>
          ))}
        </div>
      ) : (
        <div className='text-center'>검색 결과가 없습니다.</div>
      )}
    </div>
  );
};

// export const getStaticProps: GetStaticProps = async (context) => {
//   const res = await fetch('https://.../posts');
//   const posts = await res.json();

//   // By returning { props: posts }, the Blog component
//   // will receive `posts` as a prop at build time
//   return {
//     props: {
//       posts
//     }
//     // revalidate: 20
//   };
// };

export default SearchValue;
