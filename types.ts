
export enum MessageSender {
  USER = 'user',
  AGENT = 'agent',
}

export interface ChatMessage {
  sender: MessageSender;
  text: string;
}

export interface AttendanceRecord {
  subject: string;
  attended: number;
  total: number;
  percentage: number;
}

export interface ChatHistoryItem {
  id: string;
  title: string;
  messages: ChatMessage[];
}
