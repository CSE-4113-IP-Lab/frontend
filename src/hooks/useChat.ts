import { useState, useCallback } from "react";
import { agentService } from "@/services/agentService";
import type { ChatMessage, ChatSession } from "@/types/agent";

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        content,
        role: "user",
        timestamp: new Date(),
      };

      addMessage(userMessage);
      setIsLoading(true);
      setError(null);

      try {
        const response = await agentService.queryAgent(content);

        const agentMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: response.content,
          role: "agent",
          timestamp: new Date(),
          time_needed: response.time_needed,
        };

        addMessage(agentMessage);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);

        const errorResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: `❌ **Error:** ${errorMessage}. Please try again.`,
          role: "agent",
          timestamp: new Date(),
        };

        addMessage(errorResponse);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, addMessage]
  );

  const createSession = useCallback((): ChatSession => {
    return {
      id: Date.now().toString(),
      messages,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }, [messages]);

  return {
    messages,
    isLoading,
    error,
    addMessage,
    clearMessages,
    sendMessage,
    createSession,
  };
};
