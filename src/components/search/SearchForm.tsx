'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AiOutlineSearch } from 'react-icons/ai';
import classNames from 'classnames';

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
    router.push('/s/' + value);
  };

  return (
    <form
      onSubmit={handleSearchSubmit}
      className={classNames(
        'rounded-lg',
        autoInputHidden ? 'sm:bg-base-content/5' : 'bg-base-content/5'
      )}
    >
      <div className={'form-control md:overflow-visible'}>
        <div className={autoInputHidden ? 'sm:input-group' : 'input-group'}>
          <input
            className={classNames(
              'input input-sm w-full bg-transparent focus:outline-none placeholder:text-base-content/60',
              autoInputHidden ? 'hidden sm:block' : null
            )}
            defaultValue={searchValue}
            type='text'
            name='search'
            placeholder='제목 검색'
          />
          <button className='btn btn-sm btn-ghost btn-circle sm:btn-square text-lg'>
            <AiOutlineSearch />
          </button>
        </div>
      </div>
    </form>
  );
};
SearchForm.displayName = 'SearchForm';
