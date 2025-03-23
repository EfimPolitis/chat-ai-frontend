import { useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';
import { Forward, Mic, MicOff, Trash2 } from 'lucide-react';
import { useSendMessage } from '@/hooks/message/useSendMessage';
import toast from 'react-hot-toast';

const AudioRecorder = ({ chatId }: { chatId: string | null }) => {
  const userId = localStorage.getItem('userId');
  const { sendMessage } = useSendMessage();

  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isRecording) return;
    intervalRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      toast.custom(
        <div className={styles.custom_notify}>
          <Mic />
          <p>Ведётся аудио запись</p>
        </div>,
        { duration: Infinity }
      );
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = e => {
        if (e.data.size > 0) {
          setRecordedChunks(prev => [...prev, e.data]);
        }
      };
      recorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
      };
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordedChunks([]);
      setRecordingTime(0);
    } catch (err) {
      console.error('Microphone access denied or error', err);
    }
  };

  const stopRecording = () => {
    toast.dismiss();
    mediaRecorder?.stop();
    setIsRecording(false);
  };

  const handleSendAudio = () => {
    if (!userId) {
      return new Error('userId is undefind');
    }

    const blob = new Blob(recordedChunks, { type: 'audio/webm' });
    const file = new File([blob], 'recording.webm', { type: 'audio/webm' });

    sendMessage({
      chatId: chatId ? chatId : undefined,
      userId,
      file,
      type: 'audio',
    });
  };

  return (
    <div className={styles.audio_recorder}>
      {isRecording ? (
        <p>Запись... {recordingTime} сек.</p>
      ) : (
        !!recordedChunks.length && (
          <div className={styles.uploaded_audio}>
            <p>Аудио файл готов к отправке</p>
            <button
              className={styles.btn}
              title='Удалить запись'
              onClick={() => {
                setRecordedChunks([]);
                setMediaRecorder(null);
                setRecordingTime(0);
                toast.success('Запись была удалена');
              }}
            >
              <Trash2 size={30} />
            </button>
          </div>
        )
      )}
      <button
        className={styles.btn}
        onClick={
          isRecording
            ? stopRecording
            : recordedChunks.length
              ? handleSendAudio
              : startRecording
        }
        title={
          isRecording
            ? 'Остановить запись'
            : recordedChunks.length
              ? 'Отправить запись'
              : 'Использовать голосовой режим'
        }
      >
        {isRecording ? (
          <MicOff size={30} />
        ) : recordedChunks.length ? (
          <Forward size={30} />
        ) : (
          <Mic size={30} />
        )}
      </button>
    </div>
  );
};

export default AudioRecorder;
