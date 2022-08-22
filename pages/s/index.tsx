import type { NextPage } from 'next';
import Search from 'src/components/search/Search';

const SearchIndex: NextPage = () => {
  return (
    <div className='w-full max-w-screen-lg px-5 mx-auto mt-10 text-center'>
      <h1 className='text-2xl'>검색어를 입력해주세요.</h1>
      <div className='mt-10'>
        <Search />
      </div>
    </div>
  );
};

export default SearchIndex;
