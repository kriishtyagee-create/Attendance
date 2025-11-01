import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageSender, type ChatMessage as ChatMessageType, type ChatHistoryItem } from './types';
import { runConversation } from './services/geminiService';
import ChatMessage from './components/ChatMessage';
import LoadingSpinner from './components/LoadingSpinner';
import HistoryPanel from './components/HistoryPanel';

const WELCOME_MESSAGE: ChatMessageType = {
  sender: MessageSender.AGENT,
  text: `Hello! I am the IMS NSIT Attendance Agent. I can help you with your attendance records.

Try asking me something like:
- "What is the attendance for student 2021UCA1234?"
- "Check attendance for subject CS101 for semester 3"
`,
};

const App: React.FC = () => {
  const [history, setHistory] = useState<ChatHistoryItem[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessageType[]>([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Load history from localStorage on initial render
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('chatHistory');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory) as ChatHistoryItem[]);
      }
    } catch (error) {
      console.error('Failed to load chat history from localStorage:', error);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('chatHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save chat history to localStorage:', error);
    }
  }, [history]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const updateHistory = (chatId: string, newMessages: ChatMessageType[]) => {
    setHistory(prev => {
      const existingChat = prev.find(chat => chat.id === chatId);
      if (existingChat) {
        // Update existing chat
        return prev.map(chat =>
          chat.id === chatId ? { ...chat, messages: newMessages } : chat
        );
      }
      return prev;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage: ChatMessageType = {
      sender: MessageSender.USER,
      text: trimmedInput,
      id: `${Date.now()}-user`,
    };

    let currentChatId: string | null = activeChatId;
    let newMessages: ChatMessageType[] = [];

    if (currentChatId) {
      const currentChat = history.find(chat => chat.id === currentChatId);
      if (currentChat) {
        newMessages = [...currentChat.messages, userMessage];
        setMessages(newMessages);
        updateHistory(currentChatId, newMessages);
      } else {
        // fallback - start a new chat
        currentChatId = null;
      }
    }

    if (!currentChatId) {
      currentChatId = Date.now().toString();
      const newChat: ChatHistoryItem = {
        id: currentChatId,
        title: trimmedInput.substring(0, 40) + (trimmedInput.length > 40 ? '...' : ''),
        messages: [{ ...WELCOME_MESSAGE, id: `${Date.now()}-welcome` }, userMessage],
      };
      newMessages = newChat.messages;
      setHistory(prev => [newChat, ...prev]);
      setActiveChatId(currentChatId);
      setMessages(newMessages);
    }

    setInputValue('');
    setIsLoading(true);

    try {
      const agentResponseText: string = await runConversation(trimmedInput);
      const agentMessage: ChatMessageType = {
        sender: MessageSender.AGENT,
        text: agentResponseText,
        id: `${Date.now()}-agent`,
      };
      const finalMessages = [...newMessages, agentMessage];
      setMessages(finalMessages);
      updateHistory(currentChatId, finalMessages);
    } catch (error) {
      console.error('Failed to get response from agent:', error);
      const errorMessage: ChatMessageType = {
        sender: MessageSender.AGENT,
        text: 'Sorry, I ran into an issue. Please try again.',
        id: `${Date.now()}-error`,
      };
      const finalMessages = [...newMessages, errorMessage];
      setMessages(finalMessages);
      updateHistory(currentChatId, finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectChat = useCallback((chatId: string) => {
    const chat = history.find(c => c.id === chatId);
    if (chat) {
      setActiveChatId(chat.id);
      setMessages(chat.messages);
    }
  }, [history]);

  const handleNewChat = useCallback(() => {
    setActiveChatId(null);
    setMessages([WELCOME_MESSAGE]);
  }, []);

  const handleClearHistory = useCallback(() => {
    if (window.confirm('Are you sure you want to clear all chat history? This action cannot be undone.')) {
      setHistory([]);
      handleNewChat();
      localStorage.removeItem('chatHistory');
    }
  }, [handleNewChat]);

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans">
      <HistoryPanel
        history={history}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onClearHistory={handleClearHistory}
      />
      <div className="flex flex-col flex-1 h-screen">
        <header className="p-4 border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm flex-shrink-0">
          <h1 className="text-xl font-bold text-center text-gray-200">IMS NSIT Attendance Agent</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((msg, index) => (
              <ChatMessage key={`${msg.sender}-${index}-${msg.text.slice(0,20)}`} message={msg} />
            ))}
            {isLoading && (
              <div className="flex justify-start gap-3">
                <div className="w-6 h-6 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-teal-400">
                    <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v1.286a.75.75 0 0 0 .75.75h.008a7.207 7.207 0 0 1 4.5 4.5h.008a.75.75 0 0 0 .75.75v1.2" />
                  </svg>
                </div>
                <div className="bg-gray-700 text-gray-300 rounded-2xl rounded-bl-none px-4 py-3">
                  <LoadingSpinner />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </main>

        <footer className="p-4 bg-gray-900 border-t border-gray-700 flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about attendance..."
                disabled={isLoading}
                className="flex-1 w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-200 placeholder-gray-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || inputValue.trim().length === 0}
                className="p-2 rounded-full bg-teal-600 hover:bg-teal-500 disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 text-white"
                >
                  <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.5" />
                </svg>
              </button>
            </form>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;