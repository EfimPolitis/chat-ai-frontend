import { ERole, IMessage } from '@/types/message.types';
import { useEffect, useRef, useState } from 'react';
import cn from 'clsx';
import styles from './index.module.scss';
import { useParseMessage } from '@/hooks/useParseMessage';
import { Copy, CopyCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export const Message = (props: {
  children: React.ReactNode;
  message?: IMessage;
  isPending?: boolean;
}) => {
  const [copied, setCopied] = useState(false);
  const blocks = useParseMessage(props.message?.content || '');

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success('Скопированно в буфер обмена');
      setTimeout(() => setCopied(false), 5000);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  const { role, createdAt } = props.message as {
    role: string;
    createdAt: string;
  };
  const time = new Date(createdAt).toLocaleTimeString('ru-RU', {
    hour: 'numeric',
    minute: 'numeric',
  });

  return (
    <div
      className={cn(styles.message_block, {
        [styles.assistant_message]: role === ERole.ASSISTANT,
        [styles.user_message]: role === ERole.USER,
      })}
    >
      <div className={cn(styles.message)}>
        <>
          {blocks.map((block, index) =>
            block.type === 'code' ? (
              <div key={index} className={styles.code_block}>
                <div className={styles.code_header}>
                  <span>{block.language}</span>
                  <button
                    className={styles.copy_btn}
                    onClick={() => handleCopy(block.content)}
                    title={
                      copied ? 'Скопированно в буфер обмена' : 'Скопировать'
                    }
                  >
                    {copied ? (
                      <>
                        <CopyCheck size={15} />
                        <span>Скопированно</span>
                      </>
                    ) : (
                      <>
                        <Copy size={15} />
                        <span>Скопировать</span>
                      </>
                    )}
                  </button>
                </div>
                <pre>
                  <code>{block.content.trim()}</code>
                </pre>
              </div>
            ) : (
              <p key={index} className={styles.text_block}>
                {block.content}
              </p>
            )
          )}
        </>
        {props.isPending || <p className={styles.date}>{time}</p>}
      </div>
    </div>
  );
};

interface TypingMessageProps {
  text: string;
}

export const TypingMessage = ({ text }: TypingMessageProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const indexRef = useRef(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const cursorIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setDisplayedText('');
    indexRef.current = 1;

    if (intervalRef.current) clearInterval(intervalRef.current);
    if (cursorIntervalRef.current) clearInterval(cursorIntervalRef.current);

    // Печать текста
    intervalRef.current = setInterval(() => {
      setDisplayedText(text.slice(0, indexRef.current));
      indexRef.current++;

      if (indexRef.current > text.length && intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }, 20);

    cursorIntervalRef.current = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (cursorIntervalRef.current) clearInterval(cursorIntervalRef.current);
    };
  }, [text]);

  return (
    <p className={styles.typing_text}>
      {displayedText}
      <span
        className={showCursor ? styles.cursor_visible : styles.cursor_hidden}
      >
        |
      </span>
    </p>
  );
};
