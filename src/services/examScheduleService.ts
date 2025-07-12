const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1";

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

class ExamScheduleService {
  async getPublicExamSchedules(): Promise<ExamScheduleItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/public/exam-schedules`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch exam schedules:', error);
      throw error;
    }
  }

  async getExamSchedulesByProgram(programId: number): Promise<ExamScheduleItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/public/exam-schedules/program/${programId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch program exam schedules:', error);
      throw error;
    }
  }

  async getExamSchedulesByLevel(level: string): Promise<ExamScheduleItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/public/exam-schedules/level/${level}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch level exam schedules:', error);
      throw error;
    }
  }
}

export const examScheduleService = new ExamScheduleService();
