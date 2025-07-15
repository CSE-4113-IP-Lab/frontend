import type { Post, PostCreate, PostUpdate } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api/v1`
  : "http://127.0.0.1:8000/api/v1";

export class NoticeService {
  private static getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  static async getNotices(includeArchived: boolean = false): Promise<Post[]> {
    const url = `${API_BASE_URL}/posts${
      includeArchived ? "?includeArchived=true" : ""
    }`;
    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch notices");
    }
    return response.json();
  }

  static async getNotice(id: number): Promise<Post> {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch notice");
    }
    return response.json();
  }

  static async createNotice(notice: PostCreate): Promise<Post> {
    const response = await fetch(`${API_BASE_URL}/posts`, {
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
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
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
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
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

    const response = await fetch(`${API_BASE_URL}/posts/${id}/attachments`, {
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
      `${API_BASE_URL}/posts/${postId}/attachments/${fileId}`,
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
    const response = await fetch(`${API_BASE_URL}/posts/active`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      // Fallback to regular posts endpoint if active endpoint doesn't exist
      return this.getNotices(false);
    }
    return response.json();
  }

  static async getArchivedNotices(): Promise<Post[]> {
    const response = await fetch(`${API_BASE_URL}/posts/archived`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch archived notices");
    }
    return response.json();
  }

  static async getArchivedNotice(id: number): Promise<Post> {
    const response = await fetch(`${API_BASE_URL}/posts/archived/${id}`, {
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
    // Note: This endpoint might not exist in your API yet
    // You may need to create it or use a combination of active/archived counts
    try {
      const response = await fetch(`${API_BASE_URL}/posts/stats/archive`, {
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error("Stats endpoint not available");
      }
      return response.json();
    } catch {
      // Fallback: calculate stats from active and archived endpoints
      const [activeNotices, archivedNotices] = await Promise.all([
        this.getActiveNotices(),
        this.getArchivedNotices(),
      ]);

      return {
        total_posts: activeNotices.length + archivedNotices.length,
        active_posts: activeNotices.length,
        archived_posts: archivedNotices.length,
        archive_days: 30, // Default value
        archive_cutoff_date: new Date(
          Date.now() - 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
      };
    }
  }
}
