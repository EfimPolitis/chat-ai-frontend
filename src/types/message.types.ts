export interface IMessage {
  id: string;
  chatId: string;
  content: string;
  role: ERole;
  isAnimated: boolean;
  createdAt: string;
}

export enum ERole {
  ASSISTANT = 'assistant',
  USER = 'user',
}
