import { useState } from 'react';
import { UploadCloud, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './index.module.scss';
import toast from 'react-hot-toast';
import { useSendMessage } from '@/hooks/message/useSendMessage';

export const AudioUploader = ({
  fileInputRef,
  chatId,
}: {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  chatId: string | null;
}) => {
  const userId = localStorage.getItem('userId');

  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const { sendMessage, isSuccess, isError } = useSendMessage();

  const handleFileUpload = async (file: File) => {
    if (!userId) {
      toast.error('Вы не можете отправить сообщение');
      return new Error('Пользователь не определён');
    }

    if (!file.type.startsWith('audio/')) {
      toast.error('Пожалуйста, выберите аудио файл');
      return;
    }

    try {
      setUploading(true);
      setUploaded(false);

      await sendMessage({
        chatId: chatId ? chatId : undefined,
        userId,
        file,
        type: 'audio',
      });

      if (isSuccess) {
        setUploaded(true);
        setTimeout(() => setUploaded(false), 3000);
      } else if (isError) {
        toast.error('Ошибка при загрузке файла');
      }
    } catch (err) {
      toast.error('Ошибка сети');
    } finally {
      setUploading(false);
    }
  };

  //drag file
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <motion.div
      className={`${styles.uploader} ${isDragging ? styles.uploaderDragging : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={() => fileInputRef.current?.click()}
    >
      <div className={styles.iconContainer}>
        <AnimatePresence>
          {!uploading && !uploaded && (
            <motion.div
              key='upload'
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <UploadCloud size={80} className={styles.uploadIcon} />
            </motion.div>
          )}

          {uploading && (
            <motion.div
              key='loading'
              className={styles.spinner}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}

          {uploaded && (
            <motion.div
              key='done'
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <CheckCircle size={48} className={styles.doneIcon} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className={styles.text}>
        Перетащите аудио файл сюда или{' '}
        <button
          className={styles.link}
          onClick={() => fileInputRef.current?.click()}
        >
          выберите файл
        </button>
      </p>

      <input
        type='file'
        accept='audio/*'
        ref={fileInputRef}
        className='hidden'
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
        }}
      />
    </motion.div>
  );
};
