'use client';

import * as React from 'react';

import { Input } from '@/components/ui/input';
import { Cross1Icon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { useSearchParams } from 'next/navigation';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  debounce?: boolean;
}

export default function SearchInput({ debounce = false, ...props }: Props) {
  const searchParams = useSearchParams();
  const [search, setSearch] = React.useState(searchParams.get('query') ?? '');

  /* React.useEffect(() => {
    // Not debounce when search is cleared
    if (search === '') {
      searchParams.delete('query');
      setSearchParams(searchParams);
      return;
    }

    if (!debounce)
      setSearchParams(searchParams => {
        searchParams.set('query', search);
        return searchParams;
      });

    const timerId = setTimeout(
      () =>
        setSearchParams(searchParams => {
          searchParams.set('query', search);
          return searchParams;
        }),
      500,
    );

    return () => clearTimeout(timerId);
  }, [search, searchParams, setSearchParams, debounce]); */

  return (
    <div className="relative flex items-center">
      <Input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        spellCheck="false"
        className="peer px-10"
        {...props}
      />
      <MagnifyingGlassIcon className="text-muted-foreground absolute left-2.5 h-5 w-5 peer-focus:text-primary" />
      {search ? (
        <button
          className="text-muted-foreground absolute right-2.5 peer-focus:text-primary"
          onClick={() => setSearch('')}
        >
          <Cross1Icon className="h-5 w-5" />
        </button>
      ) : null}
    </div>
  );
}
