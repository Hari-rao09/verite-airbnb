import { apiClient } from "./client";
import { Booking } from "@/types";

export const bookingsApi = {
  create: async (data: {
    propertyId: string;
    checkIn: string;
    checkOut: string;
    guests: number;
  }) => {
    const response = await apiClient.post<any>("/bookings/", {
      listing_id: Number(data.propertyId),
      check_in: data.checkIn,
      check_out: data.checkOut,
      guests: data.guests,
    });

    const booking = response.data;

    return {
      id: String(booking.id),
      propertyId: String(booking.listing_id),
      guestId: String(booking.guest_id),
      checkIn: booking.check_in,
      checkOut: booking.check_out,
      guests: booking.guests,
      totalPrice: booking.total_price,
      status: booking.status.toUpperCase(),
      createdAt: booking.created_at || "",
      updatedAt: booking.updated_at || "",
    } as Booking;
  },

  getMyBookings: async () => {
    const response = await apiClient.get<any[]>("/bookings/me");

    return response.data.map((booking) => ({
      id: String(booking.id),
      propertyId: String(booking.listing_id),
      guestId: String(booking.guest_id),
      checkIn: booking.check_in,
      checkOut: booking.check_out,
      guests: booking.guests,
      totalPrice: booking.total_price,
      status: booking.status.toUpperCase(),
      createdAt: booking.created_at || "",
      updatedAt: booking.updated_at || "",
    })) as Booking[];
  },
};