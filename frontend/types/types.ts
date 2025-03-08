 export interface UserResponse {
   id: string;
   email: string;
   name: string;
   createdAt: string;
 }

 export interface userMeResponse {
  user: UserResponse
 }

 export interface AuthResponse {
   token: string;
   user: UserResponse;
 }

 export interface Hotel {
   id: string;
   name: string;
   description: string;
   address: string;
   city: string;
   state: string;
   pincode: string;
   rating: number;
   amenities: string[];
   pricePerDay: number;
   imageUrl: string;
   _count?: {
     rooms: number;
   };
 }

 export interface Room {
   id: string;
   roomNumber: string;
   roomType: RoomTypes
   description: string;
   capacity: number;
   pricePerDay: number;
   isAvailable: boolean;
   amenities: string[];
   imageUrl: string;
   hotel:{
    id:string
    name:string;
   } 
 }

 export interface RoomTypes {
   roomType: "SINGLE" | "DOUBLE" | "DELUXE" | "SUITE";
 }
 export interface Booking {
   id: string;
   userId: string;
   roomId: string;
   checkInDate: string;
   checkOutDate: string;
   totalPrice: number;
   bookingStatus: "CONFIRMED" | "CANCELED" | "COMPLETED";
   isCheckedIn: boolean;
   createdAt: string;
   updatedAt: string;
   user: {
    id:string;
    email: string;
   }
   room: Room
 }
