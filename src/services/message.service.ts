import { axiosClassic } from '@/api/interseptors';
import { IMessage } from '@/types/message.types';

export const messageService = {
  async getMessages(chatId: string) {
    const response = await axiosClassic.get<IMessage[]>(
      `/chat/message/${chatId}`
    );
    return response;
  },

  async sendMessage(
    message: {
      chatId?: string;
      userId: string;
      content?: string;
      file?: File;
    },
    type: 'text' | 'audio' = 'text'
  ) {
    const formData = new FormData();

    if (message.chatId) formData.append('chatId', message.chatId);
    if (message.content) formData.append('content', message.content);
    if (message.file) formData.append('file', message.file);
    formData.append('userId', message.userId);

    const response = await axiosClassic.post<IMessage>(
      '/chat/message',
      formData,
      {
        params: { type },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response;
  },
};
