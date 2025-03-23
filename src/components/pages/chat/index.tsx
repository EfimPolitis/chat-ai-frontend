import { useGetMessages } from '@/hooks/message/useGetMessages';
import { useLocation, useParams } from '@tanstack/react-router';

import styles from './index.module.scss';
import { FieldBlock } from '@/components/frames/field-block';
import { Loader } from '@/components/ui';
import { useEffect, useRef, useState } from 'react';
import { Message, TypingMessage } from '@/components/ui/message';
import { useSendMessage } from '@/hooks/message/useSendMessage';
import { AudioUploader } from '@/components/ui/audio-uploader';
import { axiosClassic } from '@/api/interseptors';
import { ERole } from '@/types/message.types';

const ChatPage = () => {
  const { pathname } = useLocation();
  const [chatId, setChatId] = useState<string | null>(null);

  const isChatRoute = pathname.includes('/chat');

  const params = isChatRoute
    ? useParams({
        from: '/chat/$chatId',
        select: p => p.chatId,
      })
    : null;

  useEffect(() => {
    if (isChatRoute && params) {
      setChatId(params);
    } else {
      setChatId(null);
    }
  }, [isChatRoute, params]);

  const [isVisibleAudioUploader, setIsVisibleAudioUploader] = useState(false);

  var { data, isFetching, refetch } = useGetMessages(chatId);
  const messages = data?.data;
  const { isPending } = useSendMessage();

  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    const chatWrap = bottomRef.current;
    if (chatWrap) {
      chatWrap.scrollTo({ top: chatWrap.scrollHeight });
    }
  };

  useEffect(() => {
    refetch();
  }, [chatId]);

  useEffect(() => {
    if (messages?.length) scrollToBottom();
  }, [messages]);

  const dropzoneRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      ref={dropzoneRef}
      className={styles.wrapper}
      onClick={() => {
        setIsVisibleAudioUploader(false);
      }}
      onDragOver={() => setIsVisibleAudioUploader(true)}
      onDragLeave={event => {
        const relatedTarget = event.relatedTarget as HTMLElement;
        if (
          (dropzoneRef.current &&
            !dropzoneRef.current.contains(relatedTarget)) ||
          !fileInputRef.current
        ) {
          setIsVisibleAudioUploader(false);
        }
      }}
      onDrop={() => setIsVisibleAudioUploader(false)}
    >
      {isVisibleAudioUploader && (
        <AudioUploader fileInputRef={fileInputRef} chatId={chatId} />
      )}
      {chatId && (
        <div className={styles.chat_wrap} ref={bottomRef}>
          <div className={styles.chat_block}>
            {isFetching ? (
              <Loader size={40} />
            ) : messages?.length ? (
              messages.map(message => {
                if (!message.isAnimated && message.role === ERole.ASSISTANT) {
                  axiosClassic.post(
                    `chat/message-set-animated-status/${message.id}`
                  );
                  return (
                    <Message key={message.id} message={message}>
                      <TypingMessage text={message.content} />
                    </Message>
                  );
                } else {
                  return (
                    <Message key={message.id} message={message}>
                      <p>{message.content}</p>
                    </Message>
                  );
                }
              })
            ) : (
              'Не удалось получить сообщения для данного чата  '
            )}
            {isPending && (
              <Message>
                <Loader />
              </Message>
            )}
          </div>
        </div>
      )}
      {!chatId && <h1 className={styles.title}>Чем я могу вам помочь?</h1>}
      <div className={styles.field_block}>
        <FieldBlock
          chatId={chatId}
          setIsVisibleAudioUploader={setIsVisibleAudioUploader}
        />
      </div>
    </div>
  );
};

export default ChatPage;
