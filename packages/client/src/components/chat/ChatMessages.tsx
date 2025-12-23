import { type ClipboardEvent } from 'react';
import ReactMarkdown from 'react-markdown';

export type Message = {
  content: string;
  role: 'user' | 'agent';
};

type Props = {
  messages: Message[];
};

const ChatMessages = ({ messages }: Props) => {
  const onCopyMessage = (e: ClipboardEvent<HTMLDivElement>) => {
    const selection = window.getSelection()?.toString().trim();
    if (selection) {
      e.preventDefault();
      e.clipboardData.setData('text/plain', selection);
    }
  };

  return (
    <>
      {messages.map((message, index) => (
        <div
          key={index}
          onCopy={onCopyMessage}
          className={`px-3 py-1 max-w-md rounded-xl ${
            message.role === 'user'
              ? 'bg-blue-600 text-white self-end'
              : 'bg-gray-100 text-black self-start'
          }`}
        >
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      ))}
    </>
  );
};

export default ChatMessages;
