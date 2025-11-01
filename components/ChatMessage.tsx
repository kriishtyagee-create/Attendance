
import React from 'react';
import { MessageSender } from '../types';
import type { ChatMessage as ChatMessageType } from '../types';


const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6 text-gray-400"
  >
    <path
      fillRule="evenodd"
      d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
      clipRule="evenodd"
    />
  </svg>
);

const AgentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6 text-teal-400"
  >
    <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v1.286a.75.75 0 0 0 .75.75h.008a7.207 7.207 0 0 1 4.5 4.5h.008a.75.75 0 0 0 .75.75v1.286a.75.75 0 0 0 .707.5A9.735 9.735 0 0 0 12 18a9.707 9.707 0 0 0 1.533-5.25.75.75 0 0 0-.427-.686 4.5 4.5 0 0 1-2.13-2.13.75.75 0 0 0-.686-.427ZM12.25 21a9.735 9.735 0 0 0 3.25-.555.75.75 0 0 0 .5-.707v-1.286a.75.75 0 0 0-.75-.75h-.008a7.208 7.208 0 0 1-4.5-4.5h-.008a.75.75 0 0 0-.75-.75v-1.286a.75.75 0 0 0-.707-.5A9.735 9.735 0 0 0 9 6a9.707 9.707 0 0 0-1.533 5.25.75.75 0 0 0 .427.686 4.5 4.5 0 0 1 2.13 2.13.75.75 0 0 0 .686.427Z" />
  </svg>
);


interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === MessageSender.USER;

  const wrapperClasses = isUser ? 'justify-end' : 'justify-start';
  const bubbleClasses = isUser
    ? 'bg-blue-600 text-white rounded-br-none'
    : 'bg-gray-700 text-gray-200 rounded-bl-none';

  return (
    <div className={`flex items-start gap-3 w-full ${wrapperClasses}`}>
      {!isUser && <div className="flex-shrink-0"><AgentIcon /></div>}
      <div className={`flex flex-col max-w-lg md:max-w-2xl`}>
        <div className={`px-4 py-3 rounded-2xl ${bubbleClasses}`}>
          <p className="whitespace-pre-wrap">{message.text}</p>
        </div>
      </div>
      {isUser && <div className="flex-shrink-0"><UserIcon /></div>}
    </div>
  );
};

export default ChatMessage;
