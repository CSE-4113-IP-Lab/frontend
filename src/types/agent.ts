export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "agent";
  timestamp: Date;
  time_needed?: number;
}

export interface AgentResponse {
  content: string;
  role: string;
  time_needed: number;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}
