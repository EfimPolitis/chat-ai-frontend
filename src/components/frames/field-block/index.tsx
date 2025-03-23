import { useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';
import { Forward, Paperclip } from 'lucide-react';

import cn from 'clsx';
import { TextArea } from '@/components/ui/text-area';
import { useSendMessage } from '@/hooks/message/useSendMessage';
import toast from 'react-hot-toast';
import AudioRecorder from '@/components/ui/audio-recorder';

export const FieldBlock = ({
  chatId,
  setIsVisibleAudioUploader,
}: {
  chatId: string | null;
  setIsVisibleAudioUploader: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const userId = localStorage.getItem('userId');

  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { sendMessage } = useSendMessage();

  const hangleMessageSubmit = () => {
    if (!userId) {
      toast.error('Вы не можете отправить сообщение');
      return new Error('Пользователь не определён');
    }
    if (!value.trim()) return;

    setValue('');
    if (textareaRef.current) textareaRef.current.focus();

    sendMessage({
      chatId: chatId ? chatId : undefined,
      userId,
      content: value,
      type: 'text',
    });
  };

  useEffect(() => {
    if (textareaRef.current) textareaRef.current.focus();
  }, []);

  return (
    <div className={styles.field}>
      <div className={styles.top}>
        <TextArea
          ref={textareaRef}
          onChange={event => setValue(event.target.value)}
          setValue={setValue}
          value={value}
          onKeyDown={event => {
            if (event.key === 'Enter') hangleMessageSubmit();
          }}
        />
      </div>
      <div className={styles.bottom}>
        <button
          className={cn(styles.paperclip_btn, styles.btn)}
          onClick={(event: React.MouseEvent) => {
            event.stopPropagation();
            setIsVisibleAudioUploader(prev => !prev);
          }}
        >
          <Paperclip size={30} />
        </button>
        {value.length ? (
          <button
            className={cn(styles.send_btn, styles.btn)}
            onClick={hangleMessageSubmit}
            title='Отправить запрос'
          >
            <Forward size={30} />
          </button>
        ) : (
          <AudioRecorder chatId={chatId} />
        )}
      </div>
    </div>
  );
};
