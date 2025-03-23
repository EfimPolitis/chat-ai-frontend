import { TanStackQueryKey } from '@/constants/query-key.constants';
import { chatService } from '@/services/chat.service';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const useGetChatList = (userId: string | null) => {
  const { data, isError, isFetching } = useQuery({
    queryKey: [TanStackQueryKey.getChatList],
    queryFn: () => {
      if (!userId) throw new Error('Отсутствует userId');
      return chatService.getChatList(userId);
    },
  });

  if (isError) toast.error('Произошда непредвиденная ошибка');

  return { data, isFetching };
};
