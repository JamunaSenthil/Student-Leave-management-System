import api from './api.ts';

export const wardenService = {
  async getDashboard() {
    const response = await api.get('/warden/dashboard');
    return response.data;
  },

  async getHostelStudents(params?: { search?: string; room?: string; page?: number; limit?: number }) {
    const response = await api.get('/warden/students', { params });
    return response.data;
  },

  async getHostelLeaves(params?: { status?: string; type?: string; search?: string; page?: number; limit?: number }) {
    const response = await api.get('/warden/leaves', { params });
    return response.data;
  },

  async getLeaveById(id: string) {
    const response = await api.get(`/warden/leaves/${id}`);
    return response.data;
  },

  async decideLeave(id: string, decision: 'Approved' | 'Rejected', reason?: string) {
    const response = await api.patch(`/warden/leaves/${id}/decision`, { decision, reason });
    return response.data;
  },
};
