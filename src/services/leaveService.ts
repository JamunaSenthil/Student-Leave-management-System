import api from './api.ts';

export interface ApplyLeavePayload {
  leaveType: 'Home leave' | 'Medical leave' | 'Personal leave' | 'Other';
  fromDate: string;
  toDate: string;
  reason: string;
  destination: string;
  parentContact: string;
  emergencyContact?: string;
  supportingDocument?: string;
}

export const leaveService = {
  async applyLeave(payload: ApplyLeavePayload) {
    const response = await api.post('/leaves', payload);
    return response.data;
  },

  async getMyLeaves(params?: { status?: string; type?: string; search?: string; page?: number; limit?: number }) {
    const response = await api.get('/leaves/my-leaves', { params });
    return response.data;
  },

  async getLeaveById(id: string) {
    const response = await api.get(`/leaves/${id}`);
    return response.data;
  },

  async trackLeave(id: string) {
    const response = await api.get(`/leaves/${id}/track`);
    return response.data;
  },
};
