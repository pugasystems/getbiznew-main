'use client';

import * as React from 'react';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface Props {
  onChange: (id?: number) => void;
  value?: number;
  data?: { name: string; id: number }[];
  isPending?: boolean;
  isError?: boolean;
  disabled?: boolean;
  placeholder?: string;
  searchEmptyText?: string;
  searchPlaceholder?: string;
  children?: React.ReactNode;
}

export function Combobox({
  onChange,
  value,
  data,
  isError,
  isPending,
  disabled,
  placeholder = 'Select...',
  searchEmptyText = 'No results found.',
  searchPlaceholder = 'Search...',
  children,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const active = data?.find(item => item.id === value)?.name ?? '';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger disabled={isPending || isError || disabled} asChild>
        {children ? (
          children
        ) : (
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`w-full justify-between px-3 font-normal hover:border-slate-400 hover:bg-white data-[state=open]:border-primary ${active ? '' : 'text-muted hover:text-muted'}`}
          >
            <span className="truncate">
              {isPending
                ? 'Loading...'
                : isError
                  ? 'Error fetching data!'
                  : active
                    ? active
                    : placeholder}
            </span>
            <CaretSortIcon className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="min-w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandList>
            <CommandEmpty>{searchEmptyText}</CommandEmpty>
            <CommandGroup>
              {data?.map(item => (
                <CommandItem
                  key={item.id}
                  value={item.name}
                  onSelect={() => {
                    onChange(item.id === value ? undefined : item.id);
                    setOpen(false);
                  }}
                >
                  {item.name}
                  <CheckIcon
                    className={cn(
                      'ml-auto h-4 w-4',
                      value === item.id ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
