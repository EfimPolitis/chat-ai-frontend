import { TanStackQueryKey } from '@/constants/query-key.constants';
import { messageService } from '@/services/message.service';
import { useQuery } from '@tanstack/react-query';

export const useGetMessages = (chatId: string | null) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: [TanStackQueryKey.getMessages],
    queryFn: () => {
      if (!chatId) throw new Error('Не найден id чата');
      return messageService.getMessages(chatId);
    },
  });

  return { data, isFetching, refetch };
};
