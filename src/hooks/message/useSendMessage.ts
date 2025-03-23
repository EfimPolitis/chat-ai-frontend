import { TanStackQueryKey } from '@/constants/query-key.constants';
import { messageService } from '@/services/message.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';

import toast from 'react-hot-toast';

interface ISendMessageData {
  chatId: string | undefined;
  userId: string;
  content?: string;
  file?: File;
  type: 'text' | 'audio';
}

export const useSendMessage = () => {
  const { navigate } = useRouter();
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationKey: [TanStackQueryKey.sendMessage],
    mutationFn: (data: ISendMessageData) => {
      return messageService.sendMessage(
        {
          chatId: data.chatId,
          userId: data.userId,
          content: data.content,
          file: data.file,
        },
        data.type
      );
    },
    onMutate: () => toast.loading('Обработка запроса...'),
    onSuccess: data => {
      const message = data.data;
      toast.dismiss();
      queryClient.invalidateQueries({
        queryKey: [TanStackQueryKey.getMessages],
      });
      queryClient.invalidateQueries({
        queryKey: [TanStackQueryKey.getChatList],
      });
      navigate({ to: '/chat/$chatId', params: { chatId: message.chatId } });
    },
    onError: () => {
      toast.dismiss();
      toast.error('Во время обработки запроса возникла проблема');
    },
  });

  return { sendMessage: mutate, isPending, isSuccess, isError };
};
