import ChatPage from '@/components/pages/chat';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/chat/$chatId')({
  component: () => <ChatPage />,
});
