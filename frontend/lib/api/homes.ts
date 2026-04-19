import api from './client';

export interface Home {
  id: number;
  name: string;
  adakey?: string;
  owner_id?: number;
  // Based on your database schema: name, adafruitiokey, adafruitiouser
}

export const homeService = {
  getHomes: async (): Promise<Home[]> => {
    // For now we will return some hardcoded homes to match the UI if backend doesn't exist yet, 
    // or try calling the backend if it's ready. Let's mock the UI homes first since we are building UI.
    // If backend is ready, you would un-comment the below:
    // const response = await api.get('/homes/');
    // return response.data;
    
    return [
      { id: 1, name: 'Obsidian Heights' },
      { id: 2, name: 'Crystal Lake' },
      { id: 3, name: 'Neon Lofts' },
    ];
  }
};
