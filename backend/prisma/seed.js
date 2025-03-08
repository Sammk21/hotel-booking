const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient();

async function main() {
  // Insert Hotels
  const hotels = await prisma.hotel.createMany({
    data: [
      {
        name: "The Grand Palace",
        description: "A luxurious stay...",
        address: "123 Main Street",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        imageUrl: "https://example.com/grandpalace.jpg",
        pricePerDay: 5000,
        amenities: ["WiFi", "Pool", "Gym", "Spa"],
        rating: 4.8,
      },
      {
        name: "Seaside Resort",
        description: "Enjoy the beachside view...",
        address: "456 Beach Road",
        city: "Goa",
        state: "Goa",
        pincode: "403001",
        imageUrl: "https://example.com/seasideresort.jpg",
        pricePerDay: 7000,
        amenities: ["WiFi", "Beach View", "Pool", "Bar"],
        rating: 4.7,
      },
      {
        name: "Mountain Retreat",
        description: "A peaceful retreat...",
        address: "789 Hilltop Avenue",
        city: "Manali",
        state: "Himachal Pradesh",
        pincode: "175131",
        imageUrl: "https://example.com/mountainretreat.jpg",
        pricePerDay: 6000,
        amenities: ["WiFi", "Mountain View", "Hiking Trails"],
        rating: 4.6,
      },
      {
        name: "Urban Comfort",
        description: "Modern luxury in the city...",
        address: "101 Downtown Street",
        city: "Delhi",
        state: "Delhi",
        pincode: "110001",
        imageUrl: "https://example.com/urbancomfort.jpg",
        pricePerDay: 6500,
        amenities: ["WiFi", "Gym", "Rooftop Lounge"],
        rating: 4.5,
      },
      {
        name: "Countryside Inn",
        description: "Experience tranquility...",
        address: "234 Village Road",
        city: "Jaipur",
        state: "Rajasthan",
        pincode: "302001",
        imageUrl: "https://example.com/countrysideinn.jpg",
        pricePerDay: 4800,
        amenities: ["WiFi", "Garden", "Traditional Cuisine"],
        rating: 4.4,
      },
      {
        name: "Lakeside Haven",
        description: "Serene lakeside getaway...",
        address: "567 Lake View",
        city: "Udaipur",
        state: "Rajasthan",
        pincode: "313001",
        imageUrl: "https://example.com/lakesidehaven.jpg",
        pricePerDay: 7200,
        amenities: ["WiFi", "Boat Rides", "Lake View"],
        rating: 4.9,
      },
      {
        name: "Jungle Safari Lodge",
        description: "Stay amidst wildlife...",
        address: "789 Forest Avenue",
        city: "Jim Corbett",
        state: "Uttarakhand",
        pincode: "244715",
        imageUrl: "https://example.com/junglesafari.jpg",
        pricePerDay: 5600,
        amenities: ["WiFi", "Safari", "Nature Walks"],
        rating: 4.7,
      },
      {
        name: "Heritage Palace",
        description: "A royal experience...",
        address: "321 Fort Road",
        city: "Jodhpur",
        state: "Rajasthan",
        pincode: "342001",
        imageUrl: "https://example.com/heritagepalace.jpg",
        pricePerDay: 8800,
        amenities: ["WiFi", "Cultural Shows", "Palace Tour"],
        rating: 4.8,
      },
      {
        name: "Skyline Tower",
        description: "Luxury in the clouds...",
        address: "555 Highrise Lane",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560001",
        imageUrl: "https://example.com/skylinetower.jpg",
        pricePerDay: 8500,
        amenities: ["WiFi", "Infinity Pool", "Sky Lounge"],
        rating: 4.6,
      },
      {
        name: "Desert Mirage Hotel",
        description: "A desert oasis...",
        address: "777 Sand Dunes Road",
        city: "Jaisalmer",
        state: "Rajasthan",
        pincode: "345001",
        imageUrl: "https://example.com/desertmirage.jpg",
        pricePerDay: 6000,
        amenities: ["WiFi", "Camel Rides", "Cultural Nights"],
        rating: 4.5,
      },
    ],
  });

  // Fetch inserted hotels
  const hotelData = await prisma.hotel.findMany();

  // Insert Rooms
  for (const hotel of hotelData) {
    await prisma.room.createMany({
      data: [
        {
          hotelId: hotel.id,
          roomNumber: "101",
          roomType: "DELUXE",
          capacity: 2,
          pricePerDay: 5500,
          isAvailable: true,
        },
        {
          hotelId: hotel.id,
          roomNumber: "102",
          roomType: "SUITE",
          capacity: 3,
          pricePerDay: 7500,
          isAvailable: true,
        },
        {
          hotelId: hotel.id,
          roomNumber: "103",
          roomType: "STANDARD",
          capacity: 2,
          pricePerDay: 4500,
          isAvailable: true,
        },
        {
          hotelId: hotel.id,
          roomNumber: "104",
          roomType: "EXECUTIVE",
          capacity: 4,
          pricePerDay: 8500,
          isAvailable: true,
        },
      ],
    });
  }
}

main()
  .then(() => {
    console.log("Seed data inserted successfully.");
  })
  .catch((error) => {
    console.error("Error seeding data:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
