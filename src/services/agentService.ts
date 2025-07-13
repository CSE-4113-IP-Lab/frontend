import type { AgentResponse } from "@/types/agent";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const agentService = {
  async queryAgent(query: string): Promise<AgentResponse> {
    const response = await fetch(
      `${API_BASE_URL}/agent/query?query=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to query agent: ${response.statusText}`);
    }

    return response.json();
  },
};
