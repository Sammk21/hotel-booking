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
        imageUrl:
          "https://a0.muscache.com/im/pictures/81dca5d6-5a86-49bc-8eca-4a8610a07d27.jpg",
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
        imageUrl:
          "https://news.airbnb.com/wp-content/uploads/sites/4/2019/06/PJM020719Q202_Luxe_WanakaNZ_LivingRoom_0264-LightOn_R1.jpg?fit=2500%2C1666",
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
        imageUrl:
          "https://a0.muscache.com/im/pictures/miso/Hosting-587439221666468647/original/77da70c3-2c53-4fdf-a674-93687f2ec508.jpeg?im_w=720",
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
        imageUrl:
          "https://a0.muscache.com/im/pictures/miso/Hosting-53210949/original/41b5a6a8-51e3-47be-b4a3-5885e06dd47a.jpeg?im_w=720",
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
        imageUrl:
          "https://a0.muscache.com/im/pictures/miso/Hosting-726397226628355146/original/c80eb79d-2ad0-4792-8843-82abcbb56638.jpeg?im_w=720",
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
        imageUrl:
          "https://a0.muscache.com/im/pictures/74ebe5c4-037f-4624-b544-195384e15981.jpg?im_w=720",
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
        imageUrl:
          "https://a0.muscache.com/im/pictures/hosting/Hosting-1288723712012551242/original/dc58583c-9ef7-46d6-bafb-881c026e337c.jpeg?im_w=720",
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
        imageUrl:
          "https://a0.muscache.com/im/pictures/miso/Hosting-730115009565747822/original/02b16a9d-1a81-4297-8f0b-9417ccd18b18.jpeg?im_w=720",
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
        imageUrl:
          "https://a0.muscache.com/im/pictures/7ff287a4-20b8-4f7c-9f68-16c9754d2b5c.jpg?im_w=720",
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
        imageUrl:
          "https://a0.muscache.com/im/pictures/miso/Hosting-884831703931436108/original/cc6054e4-dccb-433b-8c8f-fe4cfd9b55ae.jpeg?im_w=720",
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
