import { apiClient } from "./client";
import { Booking, HostReservation } from "@/types";

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

  getHostReservations: async () => {
    const response = await apiClient.get<any[]>("/bookings/host");

    return response.data.map((item) => ({
      id: String(item.id),
      guestId: String(item.guest_id),
      listingId: String(item.listing_id),
      checkIn: item.check_in,
      checkOut: item.check_out,
      guests: item.guests,
      totalPrice: item.total_price,
      status: (item.status || "confirmed").toUpperCase(),
      nights: item.nights || 1,
      listing: {
        id: String(item.listing?.id),
        title: item.listing?.title || "Property",
        location: item.listing?.location || "India",
        propertyType: item.listing?.property_type || "Home",
        pricePerNight: item.listing?.price_per_night || 0,
        imageUrl: item.listing?.image_url,
      },
      guest: {
        id: String(item.guest?.id),
        name: item.guest?.name || "Guest",
        email: item.guest?.email || "",
      },
    })) as HostReservation[];
  },

  updateStatus: async (bookingId: string, status: string) => {
    const response = await apiClient.patch(`/bookings/${bookingId}/status`, {
      status,
    });
    return response.data;
  },
};