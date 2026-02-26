'use client';

import ChatHistoryList from '@/components/chat/chatHistoryList';
import SearchInput from '@/components/shared/searchInput';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { ChatHistory } from '@/types';
import { API_BASE_URL } from '@/utils/constants';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { type ReactNode } from 'react';

export default function ChatLayout({ children }: { children: ReactNode }) {
  const { data: session } = useSession();

  const { data, isPending, isError } = useQuery<ChatHistory[]>({
    staleTime: 0,
    queryKey: ['messagesHistory'],
    queryFn: () =>
      fetch(
        `${API_BASE_URL}/messages/history?vendorId=${session?.user?.userId}`,
        {
          headers: { Authorization: `Bearer ${session?.user?.accessToken}` },
          cache: 'no-store',
        },
      ).then(res => res.json()),
  });

  return (
    <main className="mx-auto max-w-largest px-14 pt-14">
      <div className="my-4 flex h-[calc(100dvh-88px)] rounded-md border border-grey shadow">
        <section className="flex w-80 shrink-0 flex-col border-r border-grey">
          <div className="border-b border-grey p-4">
            <SearchInput placeholder="Search" />
          </div>
          {isPending ? (
            <ScrollArea className="flex-grow">
              <ul>
                {[...Array(7)].map((_, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-4 border-b border-grey px-4 py-4"
                  >
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-grow space-y-2.5">
                      <Skeleton className="h-2.5 w-1/2" />
                      <Skeleton className="h-2 w-3/4" />
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          ) : isError ? (
            <article className="flex flex-grow flex-col items-center justify-center">
              <p>Something went wrong!</p>
            </article>
          ) : (
            <ChatHistoryList data={data} />
          )}
        </section>
        {children}
      </div>
    </main>
  );
}
