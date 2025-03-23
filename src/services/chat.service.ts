import { axiosClassic } from '@/api/interseptors';
import { IChat } from '@/types/chat.types';

export const chatService = {
  async getChatList(userId: string) {
    const response = await axiosClassic.get<IChat[]>(`/chat/${userId}`);
    return response;
  },

  async deleteChat(chatId: string) {
    const response = await axiosClassic.delete(`chat/${chatId}`);
    return response;
  },
};
