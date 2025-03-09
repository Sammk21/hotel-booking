
# Hotel booking system

A secure Node.js backend for Hotel booking system with user authentication and secure storage.

## Features


### Hotel Management

Complete CRUD operations for hotels (admin-only for write operations)
Filtering and search capabilities for hotel listings


### Room Management

Room types with different capacities and pricing
Room availability checking based on booking dates


### Booking System

Create, view, and cancel bookings
Date validation to prevent booking conflicts
Pricing calculation based on room rates and stay duration


### Aadhaar-based Check-in

Integration with existing Aadhaar validation system
Secure storage of encrypted Aadhaar data used for check-in
Validations for check-in date and booking status

## Tech Stack

- **Node.js** with **Express.js** for the API
- **PostgreSQL** database with **Prisma ORM**
- **JWT** for authentication
- **bcrypt** for password hashing
- **crypto-js** for Aadhaar number encryption
- **nextjs** for frontend
- **shadcn** for frontend components

## Installation

1. **Clone the repository**

### For backend

```bash
git clone <repository-url>
cd hotel-booking/backend
```

### Setting up environments
Copy env.example 

### Seed database

```bash
node ./prisma/seed.js
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Copy the example environment file and update it with your own values:

```bash
cp .env.example .env
```

Edit the `.env` file with your database connection details and secrets.

4. **Set up the database and run migrations**

```bash
npx prisma migrate dev --name init
```

## Running the Application

### Development mode

```bash
npm run dev
```

### Production mode

```bash
npm start
```


### For frontend

```bash
git clone <repository-url>
cd hotel-booking/frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Copy the example environment file and update it with your own values:

```bash
cp .env.example .env
```

Edit the `.env` file with your database connection details and secrets.

## Running the Application

### Development mode

```bash
npm run dev
```

### Production mode

```bash
npm start
```

## API Endpoints

### Authentication

- **POST /api/auth/register** - Register a new user
- **POST /api/auth/login** - Login a user
- **GET /api/auth/me** - Get current user profile (requires authentication)

### Aadhaar Validation

- **POST /api/aadhaar/validate** - Validate an Aadhaar number
- **POST /api/aadhaar/verify/:aadhaarId** - Verify an Aadhaar number with mock third-party API
- **GET /api/aadhaar/records** - Get a user's Aadhaar records

### Hotel Endpoints

- **GET /api/hotels:** List all hotels with optional filters
- **GET /api/hotels/:id:** Get hotel details
- **POST /api/hotels:** Admin endpoint to create hotels
- **PUT /api/hotels/:id:** Admin endpoint to update hotels
- **DELETE /api/hotels/:id:** Admin endpoint to delete hotels

 ### Room Endpoints

- **GET /api/rooms/hotel/:hotelId:** Get rooms by hotel
- **GET /api/rooms/available/hotel/:hotelId:** Get available rooms by date range
- **GET /api/rooms/:id:** Get room details
- **POST /api/rooms/hotel/:hotelId:** Admin endpoint to create rooms
- **PUT /api/rooms/:id:** Admin endpoint to update rooms
- **DELETE /api/rooms/:id:** Admin endpoint to delete rooms

### Booking Endpoints

- **POST /api/bookings:** Create a new booking
- **GET /api/bookings/my-bookings:** Get user's bookings
- **GET /api/bookings/:id:** Get booking details
- **PATCH /api/bookings/:id/cancel:** Cancel a booking
- **POST /api/bookings/:id/check-in:** Check in with Aadhaar validation
- **GET /api/bookings:** Admin endpoint to get all bookings

## API Documentation

The API documentation is available at `/api-docs` when the server is running