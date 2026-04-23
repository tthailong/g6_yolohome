import api from './client';

export interface Home {
  id: number;
  name: string;
  adafruitiokey?: string;
  adafruitiouser?: string;
  owner_id?: number;
  // Based on your database schema: name, adafruitiokey, adafruitiouser
}

export const homeService = {
  getHomes: async (): Promise<Home[]> => {
    const response = await api.get('/homes/homes');
    return response.data;
  },
  createHome: async (homeData: Omit<Home, 'id' | 'owner_id'>): Promise<Home> => {
    const response = await api.post('/homes/', homeData);
    return response.data;
  }
};
