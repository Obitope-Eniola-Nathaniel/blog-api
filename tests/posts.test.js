const request = require("supertest");
const app = require("../app"); // Adjust the path to your app.js file

describe("Posts /api/posts", () => {
  it("should create a new post", async () => {
    const res = await request(app).post("/api/posts").send({
      title: "Test Post",
      content: "This is a test post content.",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.title).toEqual("Test Post");
    expect(res.body.content).toEqual("This is a test post content.");
  });
});
