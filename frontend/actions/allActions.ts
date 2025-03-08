"use server";
import type { Hotel, Room, Booking, UserResponse, AuthResponse } from "@/types/types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/api";

async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, options);
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

// Authentication
export async function registerUser(userData: {
  email: string;
  password: string;
  name: string;
}): Promise<UserResponse> {
    
  return fetchAPI<UserResponse>("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
}

export async function loginUser(credentials: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return fetchAPI<AuthResponse>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
}

export async function getUserProfile(token: string): Promise<UserResponse> {
  return fetchAPI<UserResponse>("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// Hotels
export async function getHotels(
  filters: Record<string, string | number> = {}
): Promise<{ success: boolean; count: number; data: Hotel[] }> {
  const query = new URLSearchParams(
    filters as Record<string, string>
  ).toString();
  return fetchAPI(`/hotels?${query}`);
}

export async function getHotelById(
  id: string
): Promise<{ success: boolean; data: Hotel }> {
  return fetchAPI(`/hotels/${id}`);
}

export async function createHotel(
  token: string,
  hotelData: Partial<Hotel>
): Promise<{ success: boolean; data: Hotel }> {
  return fetchAPI("/hotels", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(hotelData),
  });
}

export async function updateHotel(
  token: string,
  id: string,
  hotelData: Partial<Hotel>
): Promise<{ success: boolean; data: Hotel }> {
  return fetchAPI(`/hotels/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(hotelData),
  });
}

export async function deleteHotel(
  token: string,
  id: string
): Promise<{ success: boolean; message: string }> {
  return fetchAPI(`/hotels/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// Rooms
export async function getRoomsByHotel(
  hotelId: string
): Promise<{ success: boolean; count: number; data: Room[] }> {
  return fetchAPI(`/rooms/hotel/${hotelId}`);
}

export async function getRoomById(
  id: string
): Promise<{ success: boolean; data: Room }> {
  return fetchAPI(`/rooms/${id}`);
}

export async function createRoom(
  token: string,
  hotelId: string,
  roomData: Partial<Room>
): Promise<{ success: boolean; data: Room }> {
  return fetchAPI(`/rooms/hotel/${hotelId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(roomData),
  });
}

export async function updateRoom(
  token: string,
  id: string,
  roomData: Partial<Room>
): Promise<{ success: boolean; data: Room }> {
  return fetchAPI(`/rooms/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(roomData),
  });
}

export async function deleteRoom(
  token: string,
  id: string
): Promise<{ success: boolean; message: string }> {
  return fetchAPI(`/rooms/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// Bookings
export async function getBookings(
  token: string
): Promise<{ success: boolean; count: number; data: Booking[] }> {
  return fetchAPI("/bookings", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createBooking(
  token: string,
  bookingData: Partial<Booking>
): Promise<{ success: boolean; data: Booking }> {
  return fetchAPI("/bookings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingData),
  });
}

export async function cancelBooking(
  token: string,
  id: string
): Promise<{ success: boolean; message: string; data: Booking }> {
  return fetchAPI(`/bookings/${id}/cancel`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
}

/**
 * Get a booking by ID.
 */
export async function getBooking(bookingId: string): Promise<Booking> {
  const endpoint = `/bookings/${bookingId}`;
  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // Include bearer token header if needed, e.g. "Authorization": `Bearer ${token}`
    },
  };
  const result = await fetchAPI<{ success: boolean; data: Booking }>(endpoint, options);
  if (!result.success) {
    throw new Error("Failed to fetch booking");
  }
  return result.data;
}


/**
 * Check-in to a booking using Aadhaar verification.
 * This endpoint expects the booking ID (as bookingReference) and an Aadhaar number.
 */
export async function checkInBooking(bookingId: string, aadhaarNumber: string, token:string): Promise<Booking> {
  const endpoint = `/bookings/${bookingId}/check-in`;
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ aadhaarNumber }),
  };
  const result = await fetchAPI<{ success: boolean; message: string; data: Booking }>(endpoint, options);
  if (!result.success) {
    throw new Error(result.message || "Check-in failed");
  }
  return result.data;
}