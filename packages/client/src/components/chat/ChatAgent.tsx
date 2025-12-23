import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import ChatInput, { type ChatFormData } from './ChatInput';
import ChatMessages, { type Message } from './ChatMessages';
import TypingIndicator from './TypingIndicator';
import popSound from '@/assets/sounds/pop.mp3';
import notificationSound from '@/assets/sounds/notification.mp3';

const popAudio = new Audio(popSound);
popAudio.volume = 0.2;

const notificationAudio = new Audio(notificationSound);
notificationAudio.volume = 0.2;

type ChatResponse = {
  message: string;
};

const ChatAgent = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [error, setError] = useState<string>('');
  const conversationId = useRef(crypto.randomUUID());
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, [messages, isAgentTyping, error]);

  const onSubmit = async ({ prompt }: ChatFormData) => {
    try {
      setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
      setIsAgentTyping(true);
      setError('');
      popAudio.play();

      const { data } = await axios.post<ChatResponse>('/api/chat', {
        prompt,
        conversationId: conversationId.current,
      });
      setMessages((prev) => [
        ...prev,
        { content: data.message, role: 'agent' },
      ]);
      notificationAudio.play();
    } catch (error) {
      console.error(error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsAgentTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-1 gap-3 mb-6 overflow-y-auto">
        <ChatMessages messages={messages} />
        {isAgentTyping && <TypingIndicator />}
        {error && <p className="text-red-500">{error}</p>}
        <div ref={scrollAnchorRef} className="h-0" />
      </div>
      <ChatInput onSubmit={onSubmit} />
    </div>
  );
};

export default ChatAgent;
