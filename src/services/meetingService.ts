import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_SERVER_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8000/api/v1";

export interface Meeting {
  id: number;
  title: string;
  description?: string;
  created_by: number;
  date: string;
  time: string;
  platform?: string;
  link: string;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  participants: Participant[];
}

export interface Participant {
  id: number;
  user_id: number;
  status: "invited" | "accepted" | "declined";
  user?: {
    id: number;
    username: string;
    email: string;
    role?: string;
  };
}

export interface User {
  id: number;
  username: string;
  email: string;
  role?: string;
}

export interface MeetingCreate {
  title: string;
  description?: string;
  date: string;
  time: string;
  platform?: string;
  link: string;
}

export interface MeetingUpdate {
  title?: string;
  description?: string;
  date?: string;
  time?: string;
  platform?: string;
  link?: string;
  status?: "scheduled" | "ongoing" | "completed" | "cancelled";
}

export interface ParticipantCreate {
  user_id: number;
  status?: "invited" | "accepted" | "declined";
}

export type MeetingType = "created" | "invited" | "my-meetings";
export type MeetingStatus = "scheduled" | "ongoing" | "completed" | "cancelled";

class MeetingService {
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

  // Get all meetings with filters
  async getMeetings(status?: MeetingStatus): Promise<Meeting[]> {
    try {
      const params = new URLSearchParams();
      if (status) params.append("status", status);

      const response = await axios.get(
        `${API_BASE_URL}/meetings?${params.toString()}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching meetings:", error);
      throw error;
    }
  }

  // Get meetings created by current user
  async getCreatedMeetings(status?: MeetingStatus): Promise<Meeting[]> {
    try {
      const params = new URLSearchParams();
      if (status) params.append("status", status);

      const response = await axios.get(
        `${API_BASE_URL}/meetings/created/me?${params.toString()}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching created meetings:", error);
      throw error;
    }
  }

  // Get meetings where user is invited
  async getInvitedMeetings(status?: MeetingStatus): Promise<Meeting[]> {
    try {
      const params = new URLSearchParams();
      if (status) params.append("status", status);

      const response = await axios.get(
        `${API_BASE_URL}/meetings/invites/me?${params.toString()}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching invited meetings:", error);
      throw error;
    }
  }

  // Get all meetings related to user (created + invited)
  async getMyMeetings(status?: MeetingStatus): Promise<Meeting[]> {
    try {
      const params = new URLSearchParams();
      if (status) params.append("status", status);

      const response = await axios.get(
        `${API_BASE_URL}/meetings/my-meetings?${params.toString()}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching my meetings:", error);
      throw error;
    }
  }

  // Get single meeting
  async getMeeting(meetingId: number): Promise<Meeting> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/meetings/${meetingId}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching meeting:", error);
      throw error;
    }
  }

  // Create meeting
  async createMeeting(meeting: MeetingCreate): Promise<Meeting> {
    try {
      const response = await axios.post(`${API_BASE_URL}/meetings`, meeting, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error creating meeting:", error);
      throw error;
    }
  }

  // Update meeting
  async updateMeeting(
    meetingId: number,
    meeting: MeetingUpdate
  ): Promise<Meeting> {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/meetings/${meetingId}`,
        meeting,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating meeting:", error);
      throw error;
    }
  }

  // Add participant to meeting
  async addParticipant(
    meetingId: number,
    participant: ParticipantCreate
  ): Promise<any> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/meetings/${meetingId}/participants`,
        participant,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding participant:", error);
      throw error;
    }
  }

  // Update participant status (accept/decline invitation)
  async updateParticipantStatus(
    meetingId: number,
    participantId: number,
    status: "invited" | "accepted" | "declined"
  ): Promise<any> {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/meetings/${meetingId}/participants/${participantId}/status?new_status=${status}`,
        {}, // empty body
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating participant status:", error);
      throw error;
    }
  }

  // Remove participant from meeting
  async removeParticipant(
    meetingId: number,
    participantId: number
  ): Promise<any> {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/meetings/${meetingId}/participants/${participantId}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("Error removing participant:", error);
      throw error;
    }
  }

  // Get all users (for adding participants)
  async getUsers(): Promise<User[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  // Helper method to get meeting type based on current user
  getMeetingTypeForUser(
    meeting: Meeting,
    currentUserId: number
  ): "created" | "invited" | "participant" {
    if (meeting.created_by === currentUserId) {
      return "created";
    }
    const participation = meeting.participants.find(
      (p) => p.user_id === currentUserId
    );
    if (participation) {
      return participation.status === "accepted" ? "participant" : "invited";
    }
    return "invited";
  }

  // Helper method to check if meeting is upcoming
  isMeetingUpcoming(meeting: Meeting): boolean {
    const meetingDateTime = new Date(`${meeting.date}T${meeting.time}`);
    const now = new Date();
    return meetingDateTime > now && meeting.status === "scheduled";
  }
}

export const meetingService = new MeetingService();
