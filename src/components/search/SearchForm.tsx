'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AiOutlineSearch } from 'react-icons/ai';
import classNames from 'classnames';
import { useSiteSettingStore } from 'src/store/siteSetting';

interface SearchFormProps {
  searchValue?: string;
  autoInputHidden?: boolean;
  autoFocus?: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  searchValue,
  autoInputHidden = false,
  autoFocus = false
}): JSX.Element => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearchSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.stopPropagation();
    evt.preventDefault();
    const form = evt.target as HTMLFormElement;
    const value = form?.search?.value?.trim();
    if (value) {
      useSiteSettingStore.getState().closeSideBarMenu();
      router.push('/s/' + value);
    }
  };

  useEffect(() => {
    const inputEl = inputRef.current;
    if (searchValue || !autoFocus || !inputEl) {
      return;
    }
    inputEl.focus();
    if (typeof inputEl.selectionStart == 'number') {
      inputEl.selectionStart = inputEl.selectionEnd = inputEl.value.length;
    }
  }, [autoFocus, searchValue]);

  return (
    <form
      onSubmit={handleSearchSubmit}
      className={classNames(
        'rounded-lg',
        autoInputHidden ? 'sm:bg-base-content/5' : 'bg-base-content/5'
      )}
    >
      <div className='form-control md:overflow-visible'>
        <div className={autoInputHidden ? 'sm:input-group' : 'input-group'}>
          <input
            ref={inputRef}
            className={classNames(
              'input input-sm w-full bg-transparent focus:outline-none placeholder:text-base-content/60',
              autoInputHidden ? 'hidden sm:block' : null
            )}
            defaultValue={searchValue}
            type='text'
            name='search'
            placeholder='Title Search'
            aria-label='search-input'
          />
          <button
            className='btn btn-sm btn-ghost btn-circle sm:btn-square text-lg'
            aria-label='search-button'
          >
            <AiOutlineSearch />
          </button>
        </div>
      </div>
    </form>
  );
};
SearchForm.displayName = 'SearchForm';
