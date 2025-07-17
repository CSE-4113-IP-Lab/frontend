import { apiClient } from "./apiClient";

// Types for payment-related data
export interface Payment {
  id: number;
  program_id: number;
  amount: number;
  payment_method: string;
  student_id: number;
  transaction_date: string;
  status: "pending" | "completed" | "failed";
  student: {
    year: number;
    semester: number;
    registration_number: string;
    session: string;
    id: number;
    user_id: number;
    user: {
      username: string;
      email: string;
      phone: string;
      gender: string;
      role: string;
      id: number;
      is_verified: number;
      image_id: number;
      image?: {
        id: number;
        url: string;
      };
    };
  };
  program: {
    type: string;
    name: string;
    duration: number;
    description: string;
    is_active: number;
    id: number;
  };
}

export interface Fee {
  id: number;
  program_id: number;
  amount: number;
  description: string;
  due_date: string;
  program: {
    type: string;
    name: string;
    duration: number;
    description: string;
    is_active: number;
    id: number;
  };
}

export interface CreatePaymentRequest {
  program_id: number;
  amount: number;
  payment_method: string;
}

export interface CreateFeeRequest {
  program_id: number;
  amount: number;
  description: string;
  due_date: string;
}

export interface UpdatePaymentRequest {
  status: "pending" | "completed" | "failed";
}

export interface UpdateFeeRequest {
  amount: number;
  description: string;
  due_date: string;
}

class PaymentService {
  // Get all payments (Admin only)
  async getAllPayments(): Promise<Payment[]> {
    const response = await apiClient.get("/payments");
    return response.data;
  }

  // Create a new payment
  async createPayment(data: CreatePaymentRequest): Promise<Payment> {
    const response = await apiClient.post("/payments", data);
    return response.data;
  }

  // Get current user's payments
  async getMyPayments(): Promise<Payment[]> {
    const response = await apiClient.get("/payments/me");
    return response.data;
  }

  // Get all fees
  async getAllFees(): Promise<Fee[]> {
    const response = await apiClient.get("/payments/fees");
    return response.data;
  }

  // Create a new fee (Admin only)
  async createFee(data: CreateFeeRequest): Promise<Fee> {
    const response = await apiClient.post("/payments/fees", data);
    return response.data;
  }

  // Get payment by ID
  async getPaymentById(paymentId: number): Promise<Payment> {
    const response = await apiClient.get(`/payments/${paymentId}`);
    return response.data;
  }

  // Update payment status
  async updatePaymentStatus(
    paymentId: number,
    data: UpdatePaymentRequest
  ): Promise<Payment> {
    const response = await apiClient.put(`/payments/${paymentId}`, data);
    return response.data;
  }

  // Get fees by program ID
  async getFeesByProgram(programId: number): Promise<Fee[]> {
    const response = await apiClient.get(`/payments/fees/program/${programId}`);
    return response.data;
  }

  // Get fee by ID
  async getFeeById(feeId: number): Promise<Fee> {
    const response = await apiClient.get(`/payments/fees/${feeId}`);
    return response.data;
  }

  // Update fee
  async updateFee(feeId: number, data: UpdateFeeRequest): Promise<Fee> {
    const response = await apiClient.put(`/payments/fees/${feeId}`, data);
    return response.data;
  }

  // Delete fee (Admin only)
  async deleteFee(feeId: number): Promise<void> {
    await apiClient.delete(`/payments/fees/${feeId}`);
  }

  // Get current user's unpaid fees
  async getMyUnpaidFees(): Promise<Fee[]> {
    const response = await apiClient.get("/payments/fees/me/unpaid");
    return response.data;
  }

  // Get unpaid fees for a specific student (Admin only)
  async getStudentUnpaidFees(studentId: number): Promise<Fee[]> {
    const response = await apiClient.get(
      `/payments/fees/student/${studentId}/unpaid`
    );
    return response.data;
  }
}

export const paymentService = new PaymentService();
export default paymentService;
