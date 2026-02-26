import { SendSvg } from '@/assets/icons/Svgs';
import pp from '@/assets/pp.jpg';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import socket from '@/lib/socket';
import { cn } from '@/lib/utils';
import type { Message } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

interface Props {
  initialMessages: Message[];
}

export default function MessagesList({ initialMessages }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollDownRef = useRef<HTMLDivElement | null>(null);
  const { recipientUserId } = useParams();
  const queryClient = useQueryClient();

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [text, setText] = useState('');

  const { data: session } = useSession();

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    scrollDownRef.current?.scrollIntoView();
  }, [messages]);

  useEffect(() => {
    socket.on('recieve-chat', data => {
      setMessages(prev => (prev.includes(data) ? prev : [data, ...prev]));
      queryClient.invalidateQueries({ queryKey: ['messagesHistory'] });
    });
  }, [queryClient]);

  const sendMessage = () => {
    if (!text.trim() || !session) return;
    socket.emit('send-chat', {
      senderUserId: session?.user?.userId,
      recipientUserId: Number(recipientUserId),
      message: text,
    });
    setText('');
    textareaRef.current?.focus();
  };

  return (
    <>
      <ScrollArea className="flex-grow">
        <article className="flex min-h-[calc(100dvh-220px)] flex-grow flex-col justify-end py-3 pl-6 pr-14">
          <ul className="flex flex-col-reverse gap-1">
            {messages.map((item, i) => {
              const isCurrentUser = item.senderUserId === session?.user?.userId;
              const hasNextMsgFromSameUser =
                messages[i - 1]?.senderUserId === item.senderUserId;

              return (
                <li
                  className={`flex items-end gap-2 ${isCurrentUser ? 'flex-row-reverse' : ''}`}
                  key={item.id}
                >
                  {isCurrentUser ? null : (
                    <Image
                      src={pp}
                      alt="profile"
                      width={24}
                      height={24}
                      className={cn('h-6 w-6 rounded-full', {
                        invisible: hasNextMsgFromSameUser,
                      })}
                    />
                  )}
                  <div
                    className={cn(
                      'flex max-w-md gap-2 rounded-lg px-4 pt-2 shadow-sm',
                      {
                        'bg-primary text-inverted': isCurrentUser,
                        'bg-normal': !isCurrentUser,
                        'rounded-br-none':
                          !hasNextMsgFromSameUser && isCurrentUser,
                        'rounded-bl-none':
                          !hasNextMsgFromSameUser && !isCurrentUser,
                      },
                    )}
                  >
                    <p className="pb-2 text-sm">{item.message}</p>
                    <span
                      className={`self-end pb-1 text-xs ${isCurrentUser ? 'text-muted-background' : 'text-muted'}`}
                    >
                      {new Date(item.updatedAt).toLocaleTimeString('en-US', {
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
          <div ref={scrollDownRef} />
        </article>
      </ScrollArea>
      <article className="flex items-center gap-2 border-t border-grey bg-normal py-2.5 pl-4 pr-2">
        <TextareaAutosize
          ref={textareaRef}
          placeholder="Type a message"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              sendMessage();
              e.preventDefault();
            }
          }}
          autoFocus
          rows={1}
          className="block w-full resize-none rounded-lg border border-muted-background bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted focus:ring-0 focus-visible:border-primary focus-visible:outline-none "
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full"
          disabled={!text.trim()}
          onClick={sendMessage}
        >
          <SendSvg className="h-5 w-5" />
        </Button>
      </article>
    </>
  );
}
