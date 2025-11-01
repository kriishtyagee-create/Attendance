
import React, { useState } from 'react';
import type { ChatHistoryItem } from '../types';

interface HistoryPanelProps {
  history: ChatHistoryItem[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onClearHistory: () => void;
}

const NewChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.067-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);


const MenuIcon = ({ open }: { open: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
);


const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, activeChatId, onSelectChat, onNewChat, onClearHistory }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <div
        className={`bg-gray-800 border-r border-gray-700 flex flex-col transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-0'} overflow-hidden`}
      >
        <div className="p-2 flex-shrink-0">
            <button
                onClick={onNewChat}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-200 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
                aria-label="Start a new chat"
            >
                New Chat
                <NewChatIcon />
            </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {history.map(chat => (
            <a
              key={chat.id}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSelectChat(chat.id);
              }}
              className={`block px-3 py-2 text-sm rounded-md truncate transition-colors ${
                activeChatId === chat.id
                  ? 'bg-teal-600 text-white font-semibold'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              {chat.title}
            </a>
          ))}
        </nav>
        
        {history.length > 0 && (
             <div className="p-2 border-t border-gray-700 flex-shrink-0">
                <button
                    onClick={onClearHistory}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-900/50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                    aria-label="Clear all chat history"
                >
                    <TrashIcon />
                    Clear History
                </button>
            </div>
        )}
      </div>
      <div className="bg-gray-800 border-r border-gray-700 flex items-center justify-center">
         <button onClick={() => setIsOpen(!isOpen)} className="p-1 text-gray-400 hover:text-white focus:outline-none" aria-label={isOpen ? 'Collapse history panel' : 'Expand history panel'}>
            <MenuIcon open={isOpen}/>
         </button>
      </div>
    </>
  );
};

export default HistoryPanel;
