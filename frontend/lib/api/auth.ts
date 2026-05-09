import api from './client';

export const authService = {
  login: async (username: string, password: string) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response = await api.post('/auth/token', formData, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    });
    return response.data;
  },
  register: async (userData: any) => {
    const response = await api.post('/auth/', userData);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  changePassword: async (passwordData: any) => {
    await api.put('/auth/password', passwordData);
  }
};
