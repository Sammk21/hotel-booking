"use client"

import { Label } from "@/components/ui/label"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Star,
  MapPin,
  Wifi,
  Coffee,
  Utensils,
  Car,
  PocketIcon as Pool,
  Dumbbell,
  CalendarIcon,
  ChevronLeft,
} from "lucide-react"
import { hotelData } from "@/data/hotels"
import { format } from "date-fns"
import { createBooking, getHotelById, getRoomsByHotel } from "@/actions/allActions"
import { Hotel, Room, RoomTypes } from "@/types/types"

export default function HotelDetailPage() {

   const params = useParams();
   const router = useRouter();
   const hotelId = params.id as string;

   const [hotel, setHotel] = useState<Hotel | null>(null);
   const [rooms, setRooms] = useState<Room[]>([]);
   const [roomType, setRoomType] = useState<RoomTypes>({roomType:"SINGLE"});
   const [date, setDate] = useState<{
     from: Date | undefined;
     to: Date | undefined;
   }>({ from: undefined, to: undefined });
   const [guests, setGuests] = useState(1);

   useEffect(() => {
     async function fetchHotelData() {
       try {
         const { data } = await getHotelById(hotelId);
         setHotel(data);
         const { data: roomsData } = await getRoomsByHotel(hotelId);
         setRooms(roomsData);
       } catch (error) {
         console.error("Error fetching hotel details:", error);
       }
     }
     fetchHotelData();
   }, [hotelId]);

   const handleBookNow = async () => {
     if (!date.from || !date.to) {
       alert("Please select check-in and check-out dates");
       return;
     }
     try {
       const token = localStorage.getItem("authToken"); // Replace with secure auth handling
  
       if (!token) {
         alert("Please login to book a hotel");
         return;
       }
       const bookingData = {
         roomId: rooms[0]?.id, // Selecting first available room
         checkInDate: date.from.toISOString(),
         checkOutDate: date.to.toISOString(),
       };
       await createBooking(token, bookingData);
       alert("Booking successful!");
       router.push("/bookings");
     } catch (error) {
       console.error("Error booking hotel:", error);
       alert("Failed to book hotel. Please try again.");
     }
   };

   if (!hotel) {
     return <p className="text-center text-lg">Loading...</p>;
   }


console.log(rooms)


  if (!hotel) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-serif mb-4">Hotel Not Found</h1>
        <p className="text-muted-foreground mb-6">The hotel you're looking for doesn't exist.</p>
        <Button asChild variant="outline">
          <Link href="/hotels">Back to Hotels</Link>
        </Button>
      </div>
    )
  }



  const amenities = [
    { icon: <Wifi className="h-5 w-5" />, name: "Free Wi-Fi" },
    { icon: <Coffee className="h-5 w-5" />, name: "Breakfast Included" },
    { icon: <Utensils className="h-5 w-5" />, name: "Restaurant" },
    { icon: <Car className="h-5 w-5" />, name: "Free Parking" },
    { icon: <Pool className="h-5 w-5" />, name: "Swimming Pool" },
    { icon: <Dumbbell className="h-5 w-5" />, name: "Fitness Center" },
  ]

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm" className="mb-4">
            <Link href="/hotels">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Hotels
            </Link>
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-serif">{hotel.name}</h1>
              <div className="flex items-center mt-2">
                <div className="flex items-center mr-4">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                  <span className="text-sm font-medium">
                    {hotel.rating} Stars
                  </span>
                </div>
                <div className="flex items-center text-muted-foreground text-sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>
                    {hotel.city}, {hotel.state}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-xl font-medium">
              ${hotel.pricePerDay}
              
              <span className="text-muted-foreground text-sm"> / night</span>
            </div>
          </div>
        </div>

        {/* Hotel Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="lg:col-span-2 relative h-80 md:h-96">
            <Image
              src={
                hotel.imageUrl ||
                `/placeholder.svg?height=800&width=1200&text=${encodeURIComponent(
                  hotel.name
                )}`
              }
              alt={hotel.name}
              fill
              className="object-cover rounded-md"
            />
          </div>
          <div className="hidden lg:grid grid-rows-2 gap-4">
            <div className="relative h-full">
              <Image
                src={`/placeholder.svg?height=400&width=600&text=Room`}
                alt="Room"
                fill
                className="object-cover rounded-md"
              />
            </div>
            <div className="relative h-full">
              <Image
                src={`/placeholder.svg?height=400&width=600&text=Amenities`}
                alt="Amenities"
                fill
                className="object-cover rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Hotel Details */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-2xl font-serif mb-4">About</h2>
              <p className="text-muted-foreground mb-4">{hotel.description}</p>
              <p className="text-muted-foreground">
                Located in the heart of {hotel.city}, our hotel offers easy
                access to popular attractions, shopping districts, and dining
                options. Whether you're traveling for business or leisure, our
                dedicated staff is committed to ensuring your stay is nothing
                short of exceptional.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-serif mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 border border-border rounded-md"
                  >
                    <div className="mr-3 text-primary">{amenity.icon}</div>
                    <span>{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-serif mb-4">Location</h2>
              <div className="relative h-80 bg-muted rounded-md overflow-hidden">
                <Image
                  src={`/placeholder.svg?height=600&width=1200&text=Map%20of%20${encodeURIComponent(
                    hotel.city
                  )}`}
                  alt={`Map of ${hotel.city}`}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="mt-4 text-muted-foreground">
                {hotel.address}, {hotel.city}, {hotel.state}
              </p>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-background border border-border p-6 sticky top-24">
              <h2 className="text-xl font-serif mb-6">Book Your Stay</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dates">Check-in / Check-out</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="dates"
                        variant="outline"
                        className="w-full justify-start text-left font-normal rounded-none"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date.from ? (
                          date.to ? (
                            <>
                              {format(date.from, "MMM dd, yyyy")} -{" "}
                              {format(date.to, "MMM dd, yyyy")}
                            </>
                          ) : (
                            format(date.from, "MMM dd, yyyy")
                          )
                        ) : (
                          "Select dates"
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guests">Room</Label>
                  <select
                    id="rooms"
                    className="w-full h-10 px-3 py-2 bg-background border border-input rounded-none"
                    value={roomType.roomType}
                    //@ts-ignore
                    onChange={(e) => setRoomType({ roomType: e.target.value })}
                  >
                    <option>DOUBLE</option> <option>SINGLE</option>{" "}
                    <option>DELUXE</option> <option>SUITE</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guests">Guests</Label>
                  <select
                    id="guests"
                    className="w-full h-10 px-3 py-2 bg-background border border-input rounded-none"
                    value={guests}
                    onChange={(e) => setGuests(Number.parseInt(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </select>
                </div>

                {date.from && date.to && (
                  <div className="border-t border-border pt-4 mt-4">
                    <div className="flex justify-between mb-2">
                      <span>
                        ${hotel.pricePerDay} x {Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24))}{" "}
                        nights
                      </span>
                      <span>
                        ${hotel.pricePerDay * Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24))}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Taxes & fees</span>
                      <span>
                        $
                        {Math.round(
                          hotel.pricePerDay *
                            Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24)) *
                            0.15,
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between font-medium pt-2 border-t border-border">
                      <span>Total</span>
                      <span>
                        $
                        {Math.round(
                          hotel.pricePerDay *
                            Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24)) *
                            1.15,
                        )}
                      </span>
                    </div>
                  </div>
                )}

                <Button
                  className="w-full rounded-none mt-4"
                  size="lg"
                  onClick={handleBookNow}
                >
                  Book Now
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  You won't be charged yet
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

