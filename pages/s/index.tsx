import React from 'react';
import type { NextPage } from 'next';
import { SearchForm } from 'src/components/search/SearchForm';

const SearchIndex: NextPage = () => {
  return (
    <div className='w-full max-w-screen-lg m-auto my-6'>
      <div className='max-w-screen-sm mt-4 mx-auto text-center'>
        <h1 className='text-2xl'>검색어를 입력해주세요.</h1>
        <div className='mt-10'>
          <SearchForm autoFocus />
        </div>
      </div>
    </div>
  );
};

export default SearchIndex;
