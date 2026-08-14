import { apiClient } from "./client";
import { Property } from "@/types";

export const propertiesApi = {
  getAll: async () => {
    const response = await apiClient.get<any[]>("/listings/");

    return response.data.map((listing) => ({
      id: String(listing.id),
      title: listing.title,
      description: listing.description,

      price: listing.price_per_night,
      currency: "INR",

      propertyType: listing.property_type.toUpperCase(),

      maxGuests: listing.max_guests,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,

      address: listing.location,
      city: listing.location,
      country: "India",
      zipCode: "",

      latitude: 0,
      longitude: 0,

      amenities: [],

      images:
        listing.photos?.length > 0
          ? listing.photos.map(
              (photo: any) => photo.image_url
            )
          : [
              "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
            ],

      rating: 5,

      status: listing.is_active
        ? "PUBLISHED"
        : "ARCHIVED",

      hostId: String(listing.host_id),

      createdAt: "",
      updatedAt: "",
    })) as Property[];
  },

  getById: async (id: string) => {
    const response = await apiClient.get<any>(
      `/listings/${id}`
    );

    return {
      ...response.data,

      photos: response.data.photos || [],

      images:
        response.data.photos?.length > 0
          ? response.data.photos.map(
              (photo: any) => photo.image_url
            )
          : [],
    };
  },
    update: async (id: string, data: any) => {
    const response = await apiClient.put(
      `/listings/${id}`,
      data
    );

    return response.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(
      `/listings/${id}`
    );

    return response.data;
  },
  getBookedDates: async (id: string | number) => {
    const response = await apiClient.get<{ id: number; check_in: string; check_out: string }[]>(
      `/listings/${id}/booked-dates`
    );
    return response.data || [];
  },
};