import type { ClassScheduleResponse, CourseResponse } from "../types";
import type { ProgramResponse } from "./programService";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

// Admin Class Schedule Management
export interface ClassScheduleCreateRequest {
  course_id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
  room?: string;
  batch?: string;
  semester?: number;
  year?: number;
  is_active?: number;
}

export interface ClassScheduleUpdateRequest {
  course_id?: number;
  day_of_week?: string;
  start_time?: string;
  end_time?: string;
  room?: string;
  batch?: string;
  semester?: number;
  year?: number;
  is_active?: number;
}

// Admin Course Management
export interface CourseCreateRequest {
  name: string;
  course_code?: string;
  program_id: number;
  teacher_id?: number;
  credits: number;
  description?: string;
  semester?: number;
  year?: number;
  batch?: string;
}

export interface CourseUpdateRequest {
  name?: string;
  course_code?: string;
  program_id?: number;
  teacher_id?: number;
  credits?: number;
  description?: string;
  semester?: number;
  year?: number;
  batch?: string;
}

// Admin Program Management
export interface ProgramCreateRequest {
  type: string;
  name: string;
  duration: number;
  description?: string;
  is_active?: number;
}

export interface ProgramUpdateRequest {
  type?: string;
  name?: string;
  duration?: number;
  description?: string;
  is_active?: number;
}

// Exam Schedule Management
export interface ExamScheduleResponse {
  id: number;
  program_id: number;
  type: string;
  image_id?: number;
  program?: ProgramResponse;
}

export interface ExamScheduleCreateRequest {
  program_id: number;
  type: string;
}

class AdminService {
  private async getAuthHeaders(): Promise<HeadersInit> {
    // Get token from your auth context/localStorage
    const token = localStorage.getItem("access_token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // === CLASS SCHEDULE MANAGEMENT ===
  async getAllClassSchedules(
    filters: {
      course_id?: number;
      semester?: number;
      year?: number;
      batch?: string;
      day_of_week?: string;
      room?: string;
      skip?: number;
      limit?: number;
    } = {}
  ): Promise<ClassScheduleResponse[]> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/class-schedules?${params}`, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch schedules: ${response.statusText}`);
    }
    return response.json();
  }

  async createClassSchedule(
    schedule: ClassScheduleCreateRequest
  ): Promise<ClassScheduleResponse> {
    const response = await fetch(`${API_BASE_URL}/class-schedules`, {
      method: "POST",
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(schedule),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.detail || `Failed to create schedule: ${response.statusText}`
      );
    }
    return response.json();
  }

  async updateClassSchedule(
    id: number,
    schedule: ClassScheduleUpdateRequest
  ): Promise<ClassScheduleResponse> {
    const response = await fetch(`${API_BASE_URL}/class-schedules/${id}`, {
      method: "PUT",
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(schedule),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.detail || `Failed to update schedule: ${response.statusText}`
      );
    }
    return response.json();
  }

  async deleteClassSchedule(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/class-schedules/${id}`, {
      method: "DELETE",
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete schedule: ${response.statusText}`);
    }
  }

  // === COURSE MANAGEMENT ===
  async getAllCourses(
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
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch courses: ${response.statusText}`);
    }
    return response.json();
  }

  async createCourse(course: CourseCreateRequest): Promise<CourseResponse> {
    const response = await fetch(`${API_BASE_URL}/courses`, {
      method: "POST",
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(course),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.detail || `Failed to create course: ${response.statusText}`
      );
    }
    return response.json();
  }

  async updateCourse(
    id: number,
    course: CourseUpdateRequest
  ): Promise<CourseResponse> {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: "PUT",
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(course),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.detail || `Failed to update course: ${response.statusText}`
      );
    }
    return response.json();
  }

  async deleteCourse(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: "DELETE",
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete course: ${response.statusText}`);
    }
  }

  // === PROGRAM MANAGEMENT ===
  async getAllPrograms(): Promise<ProgramResponse[]> {
    const response = await fetch(`${API_BASE_URL}/programs`, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch programs: ${response.statusText}`);
    }
    return response.json();
  }

  async createProgram(program: ProgramCreateRequest): Promise<ProgramResponse> {
    const response = await fetch(`${API_BASE_URL}/programs`, {
      method: "POST",
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(program),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.detail || `Failed to create program: ${response.statusText}`
      );
    }
    return response.json();
  }

  async updateProgram(
    id: number,
    program: ProgramUpdateRequest
  ): Promise<ProgramResponse> {
    const response = await fetch(`${API_BASE_URL}/programs/${id}`, {
      method: "PUT",
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(program),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.detail || `Failed to update program: ${response.statusText}`
      );
    }
    return response.json();
  }

  async deleteProgram(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/programs/${id}`, {
      method: "DELETE",
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete program: ${response.statusText}`);
    }
  }

  // === EXAM SCHEDULE MANAGEMENT ===
  async getAllExamSchedules(): Promise<ExamScheduleResponse[]> {
    const response = await fetch(`${API_BASE_URL}/schedules`, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch exam schedules: ${response.statusText}`);
    }
    return response.json();
  }

  async createExamSchedule(
    schedule: ExamScheduleCreateRequest
  ): Promise<ExamScheduleResponse> {
    const response = await fetch(`${API_BASE_URL}/schedules`, {
      method: "POST",
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(schedule),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.detail || `Failed to create exam schedule: ${response.statusText}`
      );
    }
    return response.json();
  }

  async updateExamSchedule(
    id: number,
    schedule: Partial<ExamScheduleCreateRequest>
  ): Promise<ExamScheduleResponse> {
    const response = await fetch(`${API_BASE_URL}/schedules/${id}`, {
      method: "PUT",
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(schedule),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.detail || `Failed to update exam schedule: ${response.statusText}`
      );
    }
    return response.json();
  }

  async deleteExamSchedule(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/schedules/${id}`, {
      method: "DELETE",
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete exam schedule: ${response.statusText}`);
    }
  }

  async uploadExamScheduleImage(
    id: number,
    file: File
  ): Promise<ExamScheduleResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("access_token");
    const response = await fetch(`${API_BASE_URL}/schedules/${id}/image`, {
      method: "PUT",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.detail || `Failed to upload image: ${response.statusText}`
      );
    }
    return response.json();
  }

  // === STATISTICS ===
  async getAdminStats(): Promise<{
    totalCourses: number;
    totalPrograms: number;
    totalClassSchedules: number;
    totalExamSchedules: number;
  }> {
    try {
      const [courses, programs, classSchedules, examSchedules] =
        await Promise.all([
          this.getAllCourses({ limit: 1000 }),
          this.getAllPrograms(),
          this.getAllClassSchedules({ limit: 1000 }),
          this.getAllExamSchedules(),
        ]);

      return {
        totalCourses: courses.length,
        totalPrograms: programs.length,
        totalClassSchedules: classSchedules.length,
        totalExamSchedules: examSchedules.length,
      };
    } catch (error) {
      console.error("Failed to fetch admin stats:", error);
      return {
        totalCourses: 0,
        totalPrograms: 0,
        totalClassSchedules: 0,
        totalExamSchedules: 0,
      };
    }
  }
}

export const adminService = new AdminService();
