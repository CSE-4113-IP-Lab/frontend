import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_SERVER_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8000/api/v1";

export interface PostResponse {
  id: number;
  title: string;
  content: string;
  date: string;
  type: string;
  created_at: string;
  updated_at: string;
  attachments?: any[];
  participants?: any[];
}

export interface EventRegistrationResponse {
  message: string;
}

class EventService {
  private getAuthToken(): string | null {
    return localStorage.getItem("token");
  }

  private getHeaders() {
    const token = this.getAuthToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      "ngrok-skip-browser-warning": "true",
    };
  }

  // Helper method to get the first image from event attachments
  getEventImageUrl(event: PostResponse): string | null {
    if (event.attachments && event.attachments.length > 0) {
      // Get the first attachment and construct the full URL
      const attachment = event.attachments[0];
      let imageUrl;

      // Check if the attachment URL already contains the base URL
      if (attachment.url.startsWith("http")) {
        imageUrl = attachment.url;
      } else {
        // The backend stores file URLs as "media/posts/filename.jpg"
        // And serves them at "/api/v1/media/posts/filename.jpg"
        // So we need to remove the "media/" prefix and append to the base URL + "/media"
        const cleanUrl = attachment.url.startsWith("media/")
          ? attachment.url.substring(6)
          : attachment.url;
        const baseUrl = API_BASE_URL.endsWith("/")
          ? API_BASE_URL.slice(0, -1)
          : API_BASE_URL;
        imageUrl = `${baseUrl}/media/${cleanUrl}`;
      }

      console.log("Attachment URL from backend:", attachment.url);
      console.log("Constructed image URL:", imageUrl);
      return imageUrl;
    }
    return null;
  }

  async getUpcomingEvents(): Promise<PostResponse[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/posts/upcoming/events`,
        {
          headers: this.getHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
      throw error;
    }
  }

  async getArchivedEvents(): Promise<PostResponse[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/posts/archived/events`,
        {
          headers: this.getHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching archived events:", error);
      throw error;
    }
  }

  async registerForEvent(
    postId: number,
    userId: number
  ): Promise<EventRegistrationResponse> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/posts/${postId}/participants/${userId}`,
        {},
        {
          headers: this.getHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error registering for event:", error);
      throw error;
    }
  }

  async unregisterFromEvent(
    postId: number,
    userId: number
  ): Promise<EventRegistrationResponse> {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/posts/${postId}/participants/${userId}`,
        {
          headers: this.getHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error unregistering from event:", error);
      throw error;
    }
  }

  async getEventParticipants(postId: number): Promise<any> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/posts/${postId}/participants`,
        {
          headers: this.getHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching event participants:", error);
      throw error;
    }
  }

  async getRegisteredEvents(): Promise<PostResponse[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/posts/registered/events`,
        {
          headers: this.getHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching registered events:", error);
      throw error;
    }
  }
}

export const eventService = new EventService();
