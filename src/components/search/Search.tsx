import React from 'react';
import { useRouter } from 'next/router';
import { AiOutlineSearch } from 'react-icons/ai';

interface SearchProps {
  searchValue?: string;
  autoInputHidden?: boolean;
}

const Search: React.FC<SearchProps> = ({ searchValue, autoInputHidden }): JSX.Element => {
  const router = useRouter();

  const handleSearchSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.stopPropagation();
    evt.preventDefault();
    const form = evt.target as HTMLFormElement;
    router.push('/s/' + form.search.value);
  };

  return (
    <form onSubmit={handleSearchSubmit} method='GET' action='/s'>
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
                ? 'hidden w-full bg-transparent input sm:block'
                : 'w-full bg-transparent input'
            }
            defaultValue={searchValue}
            type='text'
            name='search'
            placeholder='제목 검색'
          />
          <button className='text-xl border-none btn btn-square bg-inherit'>
            <AiOutlineSearch />
          </button>
        </div>
      </div>
    </form>
  );
};
Search.displayName = 'Search';

export default Search;
