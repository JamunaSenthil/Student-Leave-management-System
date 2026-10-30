import api from './api.ts';

export const hodService = {
  async getDashboard() {
    const response = await api.get('/hod/dashboard');
    return response.data;
  },

  async getDepartmentStudents(params?: { search?: string; year?: string; page?: number; limit?: number }) {
    const response = await api.get('/hod/students', { params });
    return response.data;
  },

  async getDepartmentLeaves(params?: { status?: string; type?: string; search?: string; page?: number; limit?: number }) {
    const response = await api.get('/hod/leaves', { params });
    return response.data;
  },

  async getLeaveById(id: string) {
    const response = await api.get(`/hod/leaves/${id}`);
    return response.data;
  },

  async decideLeave(id: string, decision: 'Approved' | 'Rejected', reason?: string) {
    const response = await api.patch(`/hod/leaves/${id}/decision`, { decision, reason });
    return response.data;
  },
};
