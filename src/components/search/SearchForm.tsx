'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AiOutlineSearch } from 'react-icons/ai';

interface SearchFormProps {
  searchValue?: string;
  autoInputHidden?: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  searchValue,
  autoInputHidden
}): JSX.Element => {
  const router = useRouter();

  const handleSearchSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.stopPropagation();
    evt.preventDefault();
    const form = evt.target as HTMLFormElement;
    const value = form?.search?.value?.trim();
    if (value) {
      router.push('/s/' + value);
    }
  };

  return (
    <form onSubmit={handleSearchSubmit}>
      <div
        className={
          autoInputHidden
            ? 'overflow-hidden rounded-lg sm:overflow-visible md:overflow-visible sm:rounded-md form-control sm:rounded-l-none'
            : 'rounded-lg md:overflow-visible sm:rounded-md form-control sm:rounded-l-none'
        }
      >
        <div
          className={
            autoInputHidden
              ? 'max-w-lg mx-auto rounded-md sm:border border-white/10 input-group'
              : 'max-w-lg mx-auto rounded-md border border-white/10 input-group'
          }
        >
          <input
            className={
              autoInputHidden
                ? 'hidden w-full bg-transparent input input-sm sm:block'
                : 'w-full bg-transparent input input-sm'
            }
            defaultValue={searchValue}
            type='text'
            name='search'
            placeholder='제목 검색'
          />
          <button className='text-lg border-none btn btn-square bg-inherit btn-sm'>
            <AiOutlineSearch />
          </button>
        </div>
      </div>
    </form>
  );
};
SearchForm.displayName = 'SearchForm';
