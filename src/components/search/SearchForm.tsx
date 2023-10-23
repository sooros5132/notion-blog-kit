'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next-nprogress-bar';
import { AiOutlineSearch } from 'react-icons/ai';
import { useSiteSettingStore } from '@/store/siteSetting';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

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
    <form onSubmit={handleSearchSubmit} className='rounded-lg'>
      <div className='flex md:overflow-visible'>
        <div
          className={cn(
            'w-full bg-background/50 border border-border rounded-md focus-within:ring-1 focus-within:ring-foreground/70 items-center',
            autoInputHidden ? 'sm:flex' : 'flex'
          )}
        >
          <Input
            ref={inputRef}
            className={cn(
              'w-full border-none shadow-none focus-visible:ring-0 placeholder:italic',
              autoInputHidden ? 'hidden sm:block' : null
            )}
            defaultValue={searchValue}
            type='text'
            name='search'
            placeholder='Search'
            aria-label='search-input'
          />
          <Button
            variant='ghost'
            size='icon'
            className='w-auto h-auto p-1 rounded-full text-lg ring-0'
            aria-label='search-button'
          >
            <AiOutlineSearch />
          </Button>
        </div>
      </div>
    </form>
  );
};
SearchForm.displayName = 'SearchForm';
