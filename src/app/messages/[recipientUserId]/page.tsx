'use client';

import pp from '@/assets/pp.jpg';
import MessagesList from '@/components/chat/messagesList';
import { Skeleton } from '@/components/ui/skeleton';
import { ChatHistory, Message } from '@/types';
import { API_BASE_URL } from '@/utils/constants';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useParams } from 'next/navigation';

export default function Chat() {
  const { recipientUserId } = useParams();
  const { data: session } = useSession();

  const { data, isPending, isError } = useQuery<Message[]>({
    staleTime: 0,
    queryKey: ['messages', recipientUserId],
    queryFn: () =>
      fetch(
        `${API_BASE_URL}/messages?userIdOne=${session?.user?.userId}&userIdTwo=${recipientUserId}`,
        {
          headers: { Authorization: `Bearer ${session?.user?.accessToken}` },
          cache: 'no-store',
        },
      )
        .then(res => res.json())
        .then(data => data.messages),
  });

  const {
    data: chatHistory,
    isPending: isChatHistoryPending,
    isError: isChatHistoryError,
  } = useQuery<ChatHistory[]>({
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

  const activeChat = chatHistory?.find(chat => {
    const partnerUserId =
      chat.recipientUserId === session?.user?.userId
        ? chat.senderUserId
        : chat.recipientUserId;
    return partnerUserId === Number(recipientUserId);
  });
  const isPartnerSender = Number(recipientUserId) === activeChat?.senderUserId;

  return (
    <section className="flex flex-grow flex-col bg-grey">
      {isChatHistoryError ? null : (
        <article className="flex items-center gap-4 border-b border-grey bg-normal px-4 py-3">
          {isChatHistoryPending ? (
            <>
              <Skeleton className="h-11 w-11 rounded-full" />
              <div className="flex-grow space-y-2.5">
                <Skeleton className="h-2.5 w-48" />
                <Skeleton className="h-2 w-28" />
              </div>
            </>
          ) : (
            <>
              <Image
                src={pp}
                alt="profile"
                width={44}
                height={44}
                className="h-11 w-11 rounded-full"
              />
              <div>
                <h1 className="text-lg font-semibold leading-tight">
                  {isPartnerSender
                    ? `${activeChat?.sender?.firstName} ${activeChat?.sender?.lastName}`
                    : `${activeChat?.recipient?.firstName} ${activeChat?.recipient?.lastName}`}
                </h1>
                <p className="text-sm text-muted">
                  {isPartnerSender
                    ? activeChat?.sender?.mobileNumber
                    : activeChat?.recipient?.mobileNumber}
                </p>
              </div>
            </>
          )}
        </article>
      )}
      {isPending ? (
        <article className="flex flex-grow flex-col items-center justify-center bg-grey">
          <p>Loading...</p>
        </article>
      ) : isError ? (
        <article className="flex flex-grow flex-col items-center justify-center bg-grey">
          <p>Something went wrong!</p>
        </article>
      ) : (
        <MessagesList initialMessages={data} />
      )}
    </section>
  );
}
