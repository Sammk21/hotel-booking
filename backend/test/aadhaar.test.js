const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/models");

// Mock user and Aadhaar data
const testUser = {
  email: "aadhaar-test@example.com",
  password: "Password123",
};

const validAadhaar = "123456789012";
const invalidAadhaar = "12345"; // Too short

// Clean up database after tests
afterAll(async () => {
  await prisma.aadhaar.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.$disconnect();
});

describe("Aadhaar Endpoints", () => {
  let authToken;
  let aadhaarId;

  // Setup - create test user
  beforeAll(async () => {
    // Register user
    const res = await request(app).post("/api/auth/register").send(testUser);

    authToken = res.body.token;
  });

  describe("POST /api/aadhaar/validate", () => {
    it("should validate a valid Aadhaar number", async () => {
      const res = await request(app)
        .post("/api/aadhaar/validate")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ aadhaarNumber: validAadhaar });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("message");
      expect(res.body).toHaveProperty("isVerified", false);
      expect(res.body).toHaveProperty("aadhaarId");

      // Save Aadhaar ID for later tests
      aadhaarId = res.body.aadhaarId;
    });

    it("should reject an invalid Aadhaar number", async () => {
      const res = await request(app)
        .post("/api/aadhaar/validate")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ aadhaarNumber: invalidAadhaar });

      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty("error");
    });

    it("should require authentication", async () => {
      const res = await request(app)
        .post("/api/aadhaar/validate")
        .send({ aadhaarNumber: validAadhaar });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("POST /api/aadhaar/verify/:aadhaarId", () => {
    it("should verify a valid Aadhaar record", async () => {
      const res = await request(app)
        .post(`/api/aadhaar/verify/${aadhaarId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("message");
      expect(res.body).toHaveProperty("isVerified", true);
    });

    it("should reject verification for non-existent record", async () => {
      const fakeId = "00000000-0000-0000-0000-000000000000";
      const res = await request(app)
        .post(`/api/aadhaar/verify/${fakeId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty("error");
    });

    it("should require authentication", async () => {
      const res = await request(app).post(`/api/aadhaar/verify/${aadhaarId}`);

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("GET /api/aadhaar/records", () => {
    it("should return user's Aadhaar records", async () => {
      const res = await request(app)
        .get("/api/aadhaar/records")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("records");
      expect(Array.isArray(res.body.records)).toBe(true);
      expect(res.body.records.length).toBeGreaterThan(0);

      // Check record format
      const record = res.body.records[0];
      expect(record).toHaveProperty("id");
      expect(record).toHaveProperty("aadhaarNumber");
      expect(record).toHaveProperty("isVerified");
      expect(record).toHaveProperty("createdAt");
    });

    it("should require authentication", async () => {
      const res = await request(app).get("/api/aadhaar/records");

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty("error");
    });
  });
});
