import type { CourseResponse } from "../types";

const API_BASE_URL =
  import.meta.env.VITE_SERVER_URL || "http://127.0.0.1:8000/api/v1";

export interface ProgramResponse {
  id: number;
  type: string;
  name: string;
  duration: number;
  description?: string;
  is_active: number;
}

export interface ProgramCreateRequest {
  type: string;
  name: string;
  duration: number;
  description?: string;
  is_active: number;
}

export interface ProgramUpdateRequest {
  type: string;
  name: string;
  duration: number;
  description?: string;
  is_active: number;
}

export interface CourseCreateRequest {
  name: string;
  course_code: string;
  program_id: number;
  teacher_id: number;
  credits: number;
  description?: string;
  semester: number;
  year: number;
  batch: string;
}

export interface CourseUpdateRequest {
  name: string;
  course_code: string;
  program_id: number;
  teacher_id: number;
  credits: number;
  description?: string;
  semester: number;
  year: number;
  batch: string;
}

export interface ProgramOutlineResponse {
  program: ProgramResponse;
  outline: Record<string, Record<string, CourseResponse[]>>; // year -> semester -> courses
}

class ProgramService {
  private getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true",
    };
  }

  private getPublicHeaders() {
    return {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    };
  }

  // Public endpoints (no auth required)
  async getPublicPrograms(): Promise<ProgramResponse[]> {
    const response = await fetch(`${API_BASE_URL}/programs/public`, {
      headers: this.getPublicHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch programs");
    }
    return response.json();
  }

  async getPublicProgram(id: number): Promise<ProgramResponse> {
    const response = await fetch(`${API_BASE_URL}/programs/public/${id}`, {
      headers: this.getPublicHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch program");
    }
    return response.json();
  }

  async getProgramOutline(id: number): Promise<ProgramOutlineResponse> {
    const response = await fetch(
      `${API_BASE_URL}/programs/public/${id}/outline`,
      {
        headers: this.getPublicHeaders(),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch program outline");
    }
    return response.json();
  }

  // Admin endpoints (auth required)
  async getPrograms(): Promise<ProgramResponse[]> {
    const response = await fetch(`${API_BASE_URL}/programs`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch programs");
    }
    return response.json();
  }

  async createProgram(program: ProgramCreateRequest): Promise<ProgramResponse> {
    const response = await fetch(`${API_BASE_URL}/programs`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(program),
    });
    if (!response.ok) {
      throw new Error("Failed to create program");
    }
    return response.json();
  }

  async getProgram(id: number): Promise<ProgramResponse> {
    const response = await fetch(`${API_BASE_URL}/programs/${id}`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch program");
    }
    return response.json();
  }

  async updateProgram(
    id: number,
    program: ProgramUpdateRequest
  ): Promise<ProgramResponse> {
    const response = await fetch(`${API_BASE_URL}/programs/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(program),
    });
    if (!response.ok) {
      throw new Error("Failed to update program");
    }
    return response.json();
  }

  async deleteProgram(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/programs/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to delete program");
    }
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

    const response = await fetch(`${API_BASE_URL}/courses/public?${params}`, {
      headers: this.getPublicHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch courses");
    }
    return response.json();
  }

  async getPublicCourse(id: number): Promise<CourseResponse> {
    const response = await fetch(`${API_BASE_URL}/courses/public/${id}`, {
      headers: this.getPublicHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch course");
    }
    return response.json();
  }

  // Course admin endpoints (auth required)
  async getCourses(
    filters: {
      program_id?: number;
      semester?: number;
      year?: number;
      batch?: string;
      teacher_id?: number;
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

    const response = await fetch(`${API_BASE_URL}/courses?${params}`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch courses");
    }
    return response.json();
  }

  async createCourse(course: CourseCreateRequest): Promise<CourseResponse> {
    const response = await fetch(`${API_BASE_URL}/courses`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(course),
    });
    if (!response.ok) {
      throw new Error("Failed to create course");
    }
    return response.json();
  }

  async getCourse(id: number): Promise<CourseResponse> {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch course");
    }
    return response.json();
  }

  async updateCourse(
    id: number,
    course: CourseUpdateRequest
  ): Promise<CourseResponse> {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(course),
    });
    if (!response.ok) {
      throw new Error("Failed to update course");
    }
    return response.json();
  }

  async deleteCourse(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to delete course");
    }
  }
}

export const programService = new ProgramService();
