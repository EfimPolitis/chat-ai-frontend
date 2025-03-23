import { TanStackQueryKey } from '@/constants/query-key.constants';
import { chatService } from '@/services/chat.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const useDeleteChat = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationKey: [TanStackQueryKey.deleteChat],
    mutationFn: (chatId: string) => {
      return chatService.deleteChat(chatId);
    },
    onMutate: () => toast.loading('Идёт удаление чата...'),
    onSuccess: () => {
      toast.dismiss();
      toast.success('Чат был успешно удалён');
      queryClient.invalidateQueries({
        queryKey: [TanStackQueryKey.getChatList],
      });
    },
    onError: () => {
      toast.dismiss();
      toast.error('При удалении чата возникла ошибка');
    },
  });

  return { deleteChat: mutate };
};
