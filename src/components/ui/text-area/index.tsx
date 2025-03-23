import {
  TextareaHTMLAttributes,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import styles from './index.module.scss';
import { HTMLMotionProps, m } from 'framer-motion';

const maxHeight = 180;
const minHeight = 50;

interface ITextArea {
  setValue: React.Dispatch<React.SetStateAction<string>>;
  value: string;
}

type TypeTextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> &
  HTMLMotionProps<'textarea'> &
  ITextArea;

export const TextArea = ({ value, setValue, ...rest }: TypeTextAreaProps) => {
  const mirrorRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(minHeight);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setValue(text);

    if (mirrorRef.current) {
      mirrorRef.current.textContent = text + '\n';
      const mirrorHeight = mirrorRef.current.scrollHeight;

      const newHeight = Math.min(Math.max(mirrorHeight, minHeight), maxHeight);
      setHeight(newHeight);
    }
  };

  useLayoutEffect(() => {
    if (mirrorRef.current) {
      mirrorRef.current.textContent = value + '\n';
      const mirrorHeight = mirrorRef.current.scrollHeight;
      const newHeight = Math.min(Math.max(mirrorHeight, minHeight), maxHeight);
      setHeight(newHeight);
    }
  }, []);

  return (
    <>
      <m.textarea
        value={value}
        onInput={handleInput}
        placeholder='Спросите что нибудь...'
        style={{
          width: '100%',
          resize: 'none',
          overflowY: height >= maxHeight ? 'auto' : 'hidden',
        }}
        animate={{ height }}
        // transition={{ type: 'spring', stiffness: 120, damping: 14 }}
        transition={{ type: 'keyframes' }}
        className={styles.textarea}
        {...rest}
      />
      <div
        ref={mirrorRef}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          width: '100%',
          fontSize: '1rem',
          lineHeight: '1.5rem',
          padding: '0.5rem',
          boxSizing: 'border-box',
          maxWidth: '90%',
          maxHeight: '0px',
          overflow: 'hidden',
        }}
      />
    </>
  );
};
