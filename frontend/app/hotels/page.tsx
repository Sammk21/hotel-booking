"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Star, Search, MapPin } from "lucide-react"
import { hotelData } from "@/data/hotels"

export default function HotelsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedLocation, setSelectedLocation] = useState("")

  // Get unique locations from hotel data
  const locations = [...new Set(hotelData.map((hotel) => hotel.location.city))]

  // Filter hotels based on search term, price range, and location
  const filteredHotels = hotelData.filter((hotel) => {
    const matchesSearch = hotel.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPrice = hotel.price >= priceRange[0] && hotel.price <= priceRange[1]
    const matchesLocation = selectedLocation === "" || hotel.location.city === selectedLocation

    return matchesSearch && matchesPrice && matchesLocation
  })

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-serif font-light mb-4">Discover Our Luxury Hotels</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our collection of handpicked luxury accommodations around the world.
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-muted/30 p-6 mb-8 border border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search hotels..."
                  className="pl-10 rounded-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <select
                id="location"
                className="w-full h-10 px-3 py-2 bg-background border border-input rounded-none"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">All Locations</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="price-range">Price Range</Label>
                <span className="text-sm">
                  ${priceRange[0]} - ${priceRange[1]}
                </span>
              </div>
              <Slider
                id="price-range"
                min={0}
                max={1000}
                step={50}
                value={priceRange}
                onValueChange={setPriceRange}
                className="py-4"
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredHotels.length} of {hotelData.length} hotels
          </p>
        </div>

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredHotels.map((hotel) => (
            <div
              key={hotel.id}
              className="group bg-background border border-border hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={hotel.image || `/placeholder.svg?height=600&width=800&text=${encodeURIComponent(hotel.name)}`}
                  alt={hotel.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-white px-2 py-1 text-sm font-medium flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1 fill-yellow-400" />
                  <span>{hotel.rating}</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-serif text-xl">{hotel.name}</h3>
                </div>
                <div className="flex items-center text-muted-foreground text-sm mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>
                    {hotel.location.city}, {hotel.location.country}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{hotel.description}</p>
                <div className="flex justify-between items-center">
                  <p className="font-medium">
                    <span className="text-lg">${hotel.price}</span>
                    <span className="text-muted-foreground text-sm"> / night</span>
                  </p>
                  <Button asChild variant="outline" size="sm" className="rounded-none">
                    <Link href={`/hotels/${hotel.id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredHotels.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No hotels found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search filters to find what you're looking for.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setPriceRange([0, 1000])
                setSelectedLocation("")
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

