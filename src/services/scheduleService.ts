import type { ClassScheduleResponse, CourseResponse } from "../types";

const API_BASE_URL =
  import.meta.env.VITE_SERVER_URL || "http://127.0.0.1:8000/api/v1";

export interface ScheduleFilters {
  program_id?: number;
  semester?: number;
  year?: number;
  batch?: string;
  day_of_week?: string;
  room?: string;
}

export interface ProgramResponse {
  id: number;
  type: string;
  name: string;
  duration: number;
  description?: string;
  is_active: number;
}

class ScheduleService {
  // Public endpoints (no auth required)
  async getPublicSchedules(
    filters: ScheduleFilters = {}
  ): Promise<ClassScheduleResponse[]> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(
      `${API_BASE_URL}/class-schedules/public?${params}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch schedules");
    }
    return response.json();
  }

  async getPublicPrograms(): Promise<ProgramResponse[]> {
    const response = await fetch(`${API_BASE_URL}/programs/public`);
    if (!response.ok) {
      throw new Error("Failed to fetch programs");
    }
    return response.json();
  }

  async getPublicCourses(
    filters: {
      program_id?: number;
      semester?: number;
      year?: number;
      batch?: string;
    } = {}
  ): Promise<CourseResponse[]> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/courses/public?${params}`);
    if (!response.ok) {
      throw new Error("Failed to fetch courses");
    }
    return response.json();
  }

  // Authenticated endpoints (require token)
  async getMySchedule(
    token: string,
    filters: { day_of_week?: string; semester?: number; year?: number } = {}
  ): Promise<ClassScheduleResponse[]> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(
      `${API_BASE_URL}/class-schedules/my-schedule?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch personal schedule");
    }
    return response.json();
  }

  async getAllSchedules(
    token: string,
    filters: ScheduleFilters = {}
  ): Promise<ClassScheduleResponse[]> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/class-schedules?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch schedules");
    }
    return response.json();
  }

  // Admin endpoints
  async createSchedule(
    token: string,
    schedule: Omit<ClassScheduleResponse, "id" | "course">
  ): Promise<ClassScheduleResponse> {
    const response = await fetch(`${API_BASE_URL}/class-schedules`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(schedule),
    });

    if (!response.ok) {
      throw new Error("Failed to create schedule");
    }
    return response.json();
  }

  async updateSchedule(
    token: string,
    id: number,
    schedule: Partial<ClassScheduleResponse>
  ): Promise<ClassScheduleResponse> {
    const response = await fetch(`${API_BASE_URL}/class-schedules/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(schedule),
    });

    if (!response.ok) {
      throw new Error("Failed to update schedule");
    }
    return response.json();
  }

  async deleteSchedule(token: string, id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/class-schedules/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete schedule");
    }
  }
}

export const scheduleService = new ScheduleService();
