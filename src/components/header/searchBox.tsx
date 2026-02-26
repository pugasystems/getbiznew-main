'use client';

import { LocationSvg } from '@/assets/icons/Svgs';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { State } from '@/types';
import { API_BASE_URL } from '@/utils/constants';
import { CaretSortIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

export default function SearchBox() {
  const router = useRouter();
  const ref = useRef<HTMLInputElement>(null);
  const [stateId, setStateId] = useState<number>();

  const { data, isPending, isError } = useQuery<{ states: State[] }>({
    queryKey: ['states'],
    queryFn: () => fetch(`${API_BASE_URL}/states`).then(res => res.json()),
  });

  const submitHandler = () => {
    if (!ref?.current?.value) return;
    router.push(
      `/search?query=${encodeURIComponent(ref.current.value)}&stateId=${stateId}`,
    );
  };

  return (
    <form className="flex" onSubmit={e => e.preventDefault()}>
      {isPending || isError ? (
        <Button
          variant="outline"
          role="combobox"
          className="gap-1.5 rounded-none rounded-l-md px-2"
        >
          <LocationSvg className="h-4 w-4 shrink-0" />
          <span className="w-20 truncate text-start">All USA</span>
          <CaretSortIcon className="h-4 w-4" />
        </Button>
      ) : (
        <Combobox
          data={data?.states}
          value={stateId}
          onChange={id => {
            setStateId(id);
          }}
          searchEmptyText="No state found."
          searchPlaceholder="Search state..."
        >
          <Button
            variant="outline"
            role="combobox"
            className="gap-1.5 rounded-none rounded-l-md px-2"
          >
            <LocationSvg className="h-4 w-4 shrink-0" />
            <span className="w-20 truncate text-start">
              {stateId
                ? data.states.find(state => state.id === stateId)?.name
                : 'All USA'}
            </span>
            <CaretSortIcon className="h-4 w-4" />
          </Button>
        </Combobox>
      )}
      <Input
        className="w-56 rounded-none bg-white"
        placeholder="Search product / vendor"
        ref={ref}
        required
        type="search"
        onKeyDown={e => e.key === 'Enter' && submitHandler()}
      />
      <Button
        className="flex items-center gap-1 rounded-none rounded-r-md pl-2 pr-3"
        onClick={submitHandler}
      >
        <MagnifyingGlassIcon className="h-5 w-5" />
        <span>Search</span>
      </Button>
    </form>
  );
}
