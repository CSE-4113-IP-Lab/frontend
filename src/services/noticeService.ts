import type { Post, PostCreate, PostUpdate } from "@/types";

const API_ENDPOINT =
  import.meta.env.API_ENDPOINT || "http://127.0.0.1:8000";

export class NoticeService {
  private static getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  static async getNotices(): Promise<Post[]> {
    const response = await fetch(`${API_ENDPOINT}/posts`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch notices");
    }
    return response.json();
  }

  static async getNotice(id: number): Promise<Post> {
    const response = await fetch(`${API_ENDPOINT}/posts/${id}`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch notice");
    }
    return response.json();
  }

  static async createNotice(notice: PostCreate): Promise<Post> {
    const response = await fetch(`${API_ENDPOINT}/posts`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(notice),
    });
    if (!response.ok) {
      throw new Error("Failed to create notice");
    }
    return response.json();
  }

  static async updateNotice(id: number, notice: PostUpdate): Promise<Post> {
    const response = await fetch(`${API_ENDPOINT}/posts/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(notice),
    });
    if (!response.ok) {
      throw new Error("Failed to update notice");
    }
    return response.json();
  }

  static async deleteNotice(id: number): Promise<void> {
    const response = await fetch(`${API_ENDPOINT}/posts/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to delete notice");
    }
  }

  static async addAttachment(id: number, file: File): Promise<Post> {
    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("token");
    const headers: HeadersInit = {
      "ngrok-skip-browser-warning": "true",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_ENDPOINT}/posts/${id}/attachments`, {
      method: "POST",
      headers,
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Failed to add attachment");
    }
    return response.json();
  }

  static async removeAttachment(postId: number, fileId: number): Promise<Post> {
    const response = await fetch(
      `${API_ENDPOINT}/posts/${postId}/attachments/${fileId}`,
      {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to remove attachment");
    }
    return response.json();
  }

  static async getActiveNotices(): Promise<Post[]> {
    const response = await fetch(`${API_ENDPOINT}/posts/active`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch active notices");
    }
    return response.json();
  }

  static async getArchivedNotices(): Promise<Post[]> {
    const response = await fetch(`${API_ENDPOINT}/posts/archived`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch archived notices");
    }
    return response.json();
  }

  static async getArchivedNotice(id: number): Promise<Post> {
    const response = await fetch(`${API_ENDPOINT}/posts/archived/${id}`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch archived notice");
    }
    return response.json();
  }

  static async getArchiveStats(): Promise<{
    total_posts: number;
    active_posts: number;
    archived_posts: number;
    archive_days: number;
    archive_cutoff_date: string;
  }> {
    const response = await fetch(`${API_ENDPOINT}/posts/stats/archive`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch archive stats");
    }
    return response.json();
  }
}
