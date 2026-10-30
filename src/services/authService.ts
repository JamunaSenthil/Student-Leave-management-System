import api from './api.ts';

export interface StudentRegisterData {
  name: string;
  registerNumber: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  department: string;
  year: string;
  section: string;
  hostel: string;
  roomNumber: string;
}

export interface HODRegisterData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  department: string;
  officeRoom?: string;
}

export interface WardenRegisterData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  hostel: string;
  block?: string;
}

export const authService = {
  async registerStudent(data: StudentRegisterData) {
    const response = await api.post('/auth/student/register', data);
    return response.data;
  },

  async registerHOD(data: HODRegisterData) {
    const response = await api.post('/auth/hod/register', data);
    return response.data;
  },

  async registerWarden(data: WardenRegisterData) {
    const response = await api.post('/auth/warden/register', data);
    return response.data;
  },

  async loginStudent(identifier: string, password: string) {
    const response = await api.post('/auth/student/login', { identifier, password });
    return response.data;
  },

  async loginHOD(email: string, password: string) {
    const response = await api.post('/auth/hod/login', { email, password });
    return response.data;
  },

  async loginWarden(email: string, password: string) {
    const response = await api.post('/auth/warden/login', { email, password });
    return response.data;
  },

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async logout() {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('slms_token');
    localStorage.removeItem('slms_user');
    return response.data;
  },

  async resetDatabase() {
    const response = await api.post('/seed/reset');
    return response.data;
  },
};
