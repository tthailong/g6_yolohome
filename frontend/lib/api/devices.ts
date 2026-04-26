import api from "./client";

export interface DeviceControl {
  home_id: number;
  feed_name: string;
  value: string;
}

export const deviceService = {
  control: async (command: DeviceControl) => {
    const response = await api.post("/devices/control", command);
    return response.data;
  },
};
