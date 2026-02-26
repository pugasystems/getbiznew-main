'use client';

import pp from '@/assets/pp.jpg';
import { ScrollArea } from '@/components/ui/scroll-area';
import dayjs from '@/lib/dayjs';
import { ChatHistory } from '@/types';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const ChatHistoryCard = ({ item }: { item: ChatHistory }) => {
  const { recipientUserId } = useParams();
  const { data: session } = useSession();

  const partnerUserId =
    item.recipientUserId === session?.user?.userId
      ? item.senderUserId
      : item.recipientUserId;

  return (
    <li>
      <Link
        href={`/messages/${partnerUserId}`}
        className={`flex cursor-pointer items-center gap-4 border-b border-grey px-4 py-4 transition-colors ${Number(recipientUserId) === partnerUserId ? 'bg-grey' : 'hover:bg-slate-50'}`}
      >
        <Image
          src={pp}
          alt="profile"
          width={48}
          height={48}
          className="h-12 w-12 rounded-full"
        />
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <h3 className="line-clamp-1 font-medium">
              {partnerUserId === item.senderUserId
                ? `${item.sender.firstName} ${item.sender.lastName}`
                : `${item.recipient.firstName} ${item.recipient.lastName}`}
            </h3>
            <span className="whitespace-nowrap text-xs font-medium text-muted">
              {dayjs(new Date()).diff(item.updatedAt, 'hours') >= 24
                ? dayjs(item.updatedAt).fromNow()
                : new Date(item.updatedAt).toLocaleTimeString('en-US', {
                    timeStyle: 'short',
                  })}
            </span>
          </div>
          <p className="line-clamp-1 text-sm text-muted">{item.message}</p>
        </div>
      </Link>
    </li>
  );
};

interface Props {
  data: ChatHistory[];
}

export default function ChatHistoryList({ data }: Props) {
  return data.length === 0 || data[0] === null ? (
    <div className="flex flex-grow flex-col items-center justify-center gap-1">
      <h3 className="text-xl font-semibold">No conversations yet</h3>
      <p className="text-sm font-medium text-muted">
        Order something to get started
      </p>
    </div>
  ) : (
    <ScrollArea className="flex-grow">
      <ul>
        {data.map(item => (
          <ChatHistoryCard key={item.id} item={item} />
        ))}
      </ul>
    </ScrollArea>
  );
}
