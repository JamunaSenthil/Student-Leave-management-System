import api from './api.ts';

export const studentService = {
  async getProfile() {
    const response = await api.get('/students/profile');
    return response.data;
  },

  async updateProfile(data: { phone?: string; roomNumber?: string; section?: string; year?: string }) {
    const response = await api.patch('/students/profile', data);
    return response.data;
  },

  async getDashboard() {
    const response = await api.get('/students/dashboard');
    return response.data;
  },
};
