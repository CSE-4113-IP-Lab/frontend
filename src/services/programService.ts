import type { CourseResponse } from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

export interface ProgramResponse {
  id: number;
  type: string;
  name: string;
  duration: number;
  description?: string;
  is_active: number;
}

export interface ProgramOutlineResponse {
  program: ProgramResponse;
  outline: Record<string, Record<string, CourseResponse[]>>; // year -> semester -> courses
}

class ProgramService {
  // Public endpoints (no auth required)
  async getPublicPrograms(): Promise<ProgramResponse[]> {
    const response = await fetch(`${API_BASE_URL}/programs/public`);
    if (!response.ok) {
      throw new Error("Failed to fetch programs");
    }
    return response.json();
  }

  async getPublicProgram(id: number): Promise<ProgramResponse> {
    const response = await fetch(`${API_BASE_URL}/programs/public/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch program");
    }
    return response.json();
  }

  async getProgramOutline(id: number): Promise<ProgramOutlineResponse> {
    const response = await fetch(
      `${API_BASE_URL}/programs/public/${id}/outline`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch program outline");
    }
    return response.json();
  }

  async getPublicCourses(
    filters: {
      program_id?: number;
      semester?: number;
      year?: number;
      batch?: string;
      skip?: number;
      limit?: number;
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

  async getPublicCourse(id: number): Promise<CourseResponse> {
    const response = await fetch(`${API_BASE_URL}/courses/public/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch course");
    }
    return response.json();
  }
}

export const programService = new ProgramService();
