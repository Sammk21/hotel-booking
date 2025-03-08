const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/models");

// Mock user data
const testUser = {
  email: "test@example.com",
  password: "Password123",
};

// Clean up database after tests
afterAll(async () => {
  await prisma.aadhaar.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.$disconnect();
});

describe("Authentication Endpoints", () => {
  let authToken;

  describe("POST /api/auth/register", () => {
    it("should register a new user and return JWT token", async () => {
      const res = await request(app).post("/api/auth/register").send(testUser);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("token");
      expect(res.body).toHaveProperty("user");
      expect(res.body.user).toHaveProperty("id");
      expect(res.body.user).toHaveProperty("email", testUser.email);

      // Store token for future tests
      authToken = res.body.token;
    });

    it("should not allow registration with existing email", async () => {
      const res = await request(app).post("/api/auth/register").send(testUser);

      expect(res.statusCode).toEqual(500); // In our implementation, this is handled by the error middleware
      expect(res.body).toHaveProperty("error");
    });

    it("should not allow registration with invalid email", async () => {
      const res = await request(app).post("/api/auth/register").send({
        email: "invalid-email",
        password: testUser.password,
      });

      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty("error");
    });

    it("should not allow registration with weak password", async () => {
      const res = await request(app).post("/api/auth/register").send({
        email: "another@example.com",
        password: "weak",
      });

      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login and return JWT token", async () => {
      const res = await request(app).post("/api/auth/login").send(testUser);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body).toHaveProperty("user");
      expect(res.body.user).toHaveProperty("email", testUser.email);

      // Update token for future tests
      authToken = res.body.token;
    });

    it("should not login with incorrect password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: "WrongPassword123",
      });

      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty("error");
    });

    it("should not login with non-existent email", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "nonexistent@example.com",
        password: testUser.password,
      });

      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("GET /api/auth/me", () => {
    it("should return user profile if authenticated", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("user");
      expect(res.body.user).toHaveProperty("email", testUser.email);
    });

    it("should not allow access without token", async () => {
      const res = await request(app).get("/api/auth/me");

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty("error");
    });

    it("should not allow access with invalid token", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid-token");

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty("error");
    });
  });
});
