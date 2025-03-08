"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { format } from "date-fns"
import { Booking } from "@/types/types"
import { getBookings } from "@/actions/allActions"

export default function BookingConfirmPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
      const fetchBookings = async () => {
        try {
          const token = localStorage.getItem("authToken");
          if (!token) throw new Error("Unauthorized");
            console.log(token)
          const response = await getBookings(token);
          console.log(response)
          setBookings(response.data);
        } catch (err) {
          setError("Failed to load bookings.");
        } finally {
          setLoading(false);
        }
      };

      fetchBookings();
    }, []);

    console.log(bookings)
  
  if (bookings.length === 0 ) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-serif mb-4">
          Looks like you havent made any booking yet
        </h1>
        <p className="text-muted-foreground mb-6">
          Please select a hotel before Book to see it here.
        </p>
        <Button asChild variant="outline">
          <Link href="/hotels">Browse Hotels</Link>
        </Button>
      </div>
    );
  }
   if (error) {
     return (
       <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center">
         <h1 className="text-2xl font-serif mb-4">
          Something wrong happened direing data fetching
         </h1>
         <p className="text-muted-foreground mb-6">
           Please select a hotel before Book to see it here.
         </p>
         <Button asChild variant="outline">
           <Link href="/hotels">Browse Hotels</Link>
         </Button>
       </div>
     );
   }

return(
  <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
       { bookings.map((booking) => (
          <div className="bg-background border border-border p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl font-serif mb-2">
              Booking {booking.bookingStatus}!
            </h1>
            <p className="text-muted-foreground mb-6">
              Your reservation at {booking.room.hotel.name} has been confirmed.
              A confirmation email has been sent to your email address.
            </p>

            <div className="bg-muted/30 p-6 mb-6 text-left">
              <h2 className="font-medium mb-4">Booking Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Hotel</p>
                  <p className="font-medium">{booking.room.hotel.name}</p>
                </div>
              
                <div>
                  <p className="text-sm text-muted-foreground">Check-in</p>
                  <p>{format(booking.checkInDate, "EEEE, MMMM d, yyyy")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Check-out</p>
                  <p>{format(booking.checkOutDate, "EEEE, MMMM d, yyyy")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Guests Capacity</p>
                  <p>
                    {booking.room.capacity} 
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Booking Reference
                  </p>
                  <p className="font-medium">
                   {booking.id}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="rounded-none">
                <Link href="/check-in">Proceed to Web Check-in</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-none"
              >
                <Link href="/">Return to Home</Link>
              </Button>
            </div>
          </div>
      ))}
        </div>
      </div>
  )
      
  }

