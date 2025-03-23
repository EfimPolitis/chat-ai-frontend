type MessageBlock =
  | { type: 'code'; language: string; content: string }
  | { type: 'text'; content: string };

export const useParseMessage = (message: string): MessageBlock[] => {
  const regex = /```(\w+)?\n([\s\S]*?)```/g;
  const result: MessageBlock[] = [];

  let lastIndex = 0;
  let match;

  while ((match = regex.exec(message)) !== null) {
    if (match.index > lastIndex) {
      result.push({
        type: 'text',
        content: message.slice(lastIndex, match.index),
      });
    }

    const language = match[1] || 'plaintext';
    const codeContent = match[2];

    result.push({
      type: 'code',
      language,
      content: codeContent,
    });

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < message.length) {
    result.push({
      type: 'text',
      content: message.slice(lastIndex),
    });
  }

  return result;
};
