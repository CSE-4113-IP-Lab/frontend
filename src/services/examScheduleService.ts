const API_BASE_URL =
  import.meta.env.VITE_SERVER_URL || "http://127.0.0.1:8000/api/v1";

export interface ExamScheduleItem {
  id: number;
  courseName: string;
  examDate: string;
  examTime: string;
  roomNo: string;
  level: "Undergraduate" | "Masters";
  course_id?: number;
  program_id?: number;
}

// New API response interface matching the API specification
export interface ExamScheduleResponse {
  course_id: number;
  exam_date: string;
  type: string;
  start_time: string;
  end_time: string;
  room: string;
  batch: string;
  semester: number;
  year: number;
  id: number;
  course: {
    name: string;
    course_code: string;
    program_id: number;
    teacher_id: number;
    credits: number;
    description: string;
    semester: number;
    year: number;
    batch: string;
    id: number;
  };
}

export interface ExamScheduleCreateRequest {
  course_id: number;
  exam_date: string;
  type: string;
  start_time: string;
  end_time: string;
  room: string;
  batch: string;
  semester: number;
  year: number;
}

export interface ExamScheduleFilters {
  program_id?: number;
  semester?: number;
  year?: number;
  batch?: string;
  type?: string;
  exam_date?: string;
  room?: string;
  course_id?: number;
  skip?: number;
  limit?: number;
}

class ExamScheduleService {
  // Get public exam schedules (API #1)
  async getPublicExamSchedules(
    filters?: ExamScheduleFilters
  ): Promise<ExamScheduleResponse[]> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, value.toString());
          }
        });
      }

      const url = `${API_BASE_URL}/exam-schedules/public${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch public exam schedules:", error);
      throw error;
    }
  }

  // Get my personal exam schedule (API #2)
  async getMyExamSchedule(
    token: string,
    filters?: Partial<ExamScheduleFilters>
  ): Promise<ExamScheduleResponse[]> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, value.toString());
          }
        });
      }

      const url = `${API_BASE_URL}/exam-schedules/my-schedule${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch my exam schedule:", error);
      throw error;
    }
  }

  // Create new exam schedule (API #3)
  async createExamSchedule(
    token: string,
    scheduleData: ExamScheduleCreateRequest
  ): Promise<ExamScheduleResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/exam-schedules`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(scheduleData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to create exam schedule:", error);
      throw error;
    }
  }

  // Get all exam schedules (API #4) - Admin access
  async getAllExamSchedules(
    token: string,
    filters?: ExamScheduleFilters
  ): Promise<ExamScheduleResponse[]> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, value.toString());
          }
        });
      }

      const url = `${API_BASE_URL}/exam-schedules${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch all exam schedules:", error);
      throw error;
    }
  }

  // Get exam schedule by ID (API #5)
  async getExamScheduleById(
    token: string,
    scheduleId: number
  ): Promise<ExamScheduleResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/exam-schedules/${scheduleId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch exam schedule:", error);
      throw error;
    }
  }

  // Update exam schedule (API #6)
  async updateExamSchedule(
    token: string,
    scheduleId: number,
    scheduleData: ExamScheduleCreateRequest
  ): Promise<ExamScheduleResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/exam-schedules/${scheduleId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(scheduleData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to update exam schedule:", error);
      throw error;
    }
  }

  // Delete exam schedule (API #7)
  async deleteExamSchedule(token: string, scheduleId: number): Promise<void> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/exam-schedules/${scheduleId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to delete exam schedule:", error);
      throw error;
    }
  }

  // Legacy methods for backward compatibility
  async getExamSchedulesByProgram(
    programId: number
  ): Promise<ExamScheduleItem[]> {
    try {
      const schedules = await this.getPublicExamSchedules({
        program_id: programId,
      });
      return this.convertToLegacyFormat(schedules);
    } catch (error) {
      console.error("Failed to fetch program exam schedules:", error);
      throw error;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getExamSchedulesByLevel(_level: string): Promise<ExamScheduleItem[]> {
    try {
      // This would need to be mapped to appropriate filters based on the level
      const schedules = await this.getPublicExamSchedules();
      return this.convertToLegacyFormat(schedules);
    } catch (error) {
      console.error("Failed to fetch level exam schedules:", error);
      throw error;
    }
  }

  // Helper method to convert new API format to legacy format
  private convertToLegacyFormat(
    schedules: ExamScheduleResponse[]
  ): ExamScheduleItem[] {
    return schedules.map((schedule) => ({
      id: schedule.id,
      courseName: schedule.course.name,
      examDate: schedule.exam_date,
      examTime: `${schedule.start_time} - ${schedule.end_time}`,
      roomNo: schedule.room,
      level: schedule.course.program_id === 1 ? "Undergraduate" : "Masters",
      course_id: schedule.course_id,
      program_id: schedule.course.program_id,
    }));
  }
}

export const examScheduleService = new ExamScheduleService();
