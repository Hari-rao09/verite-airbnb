import { apiClient } from "./client";
import { Favorite } from "@/types";

export const favoritesApi = {
  getAll: async () => {
    const response = await apiClient.get<Favorite[]>("/wishlist/");
    return response.data;
  },

  add: async (propertyId: string) => {
    const response = await apiClient.post<Favorite>(
      `/wishlist/${propertyId}`
    );
    return response.data;
  },

  remove: async (propertyId: string) => {
    await apiClient.delete(`/wishlist/${propertyId}`);
  },
};