import request from "supertest";
import app from "../src";
import redisClient from "../src/utils/redis";

import { getBooks } from "../src/controllers/books";
import { connectMongo } from "../src/config/mongo";

jest.mock("../src/config/mongo", () => ({
  connectMongo: jest.fn(),
}));

jest.mock("../src/utils/redis", () => ({
  get: jest.fn(),
  setEx: jest.fn(),
}));

jest.mock("../src/controllers/books", () => ({
  insertBook: jest.fn(),
  getBooks: jest.fn(),
  getSingleBook: jest.fn(),
  updateBook: jest.fn(),
  deleteBook: jest.fn(),
}));

describe("/books GET route ", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should fetch cached books when available", async () => {
    const mockBook = [
      {
        name: "Java 101",
        author: "Jon Doe",
        publishedDate: "1949-06-08T00:00:00.000Z",
        ratings: 5,
        price: 25,
      },
    ];

    (redisClient.get as jest.Mock).mockResolvedValueOnce(
      JSON.stringify(mockBook)
    );

    (connectMongo as jest.Mock).mockResolvedValueOnce(undefined);
    const response = await request(app).get("/api/v1/books");

    expect(response.status).toBe(200);
    expect(redisClient.get).toHaveBeenCalledWith("cached_books");
    expect(response.body).toEqual({ books: [...mockBook] });
  });

  it("should fetch books from the database and cache them if not cached", async () => {
    const mockBook = [
      {
        name: "Java 101",
        author: "Jon Doe",
        publishedDate: "1949-06-08T00:00:00.000Z",
        ratings: 5,
        price: 25,
      },
    ];

    (redisClient.get as jest.Mock).mockResolvedValue(null);
    (connectMongo as jest.Mock).mockResolvedValueOnce(undefined);
    (getBooks as jest.Mock).mockResolvedValue(mockBook);

    const response = await request(app).get("/api/v1/books");
    expect(response.status).toBe(200);
    expect(redisClient.get).toHaveBeenCalledWith("cached_books");
    expect(getBooks).toHaveBeenCalledWith({});
    expect(redisClient.setEx).toHaveBeenCalledWith(
      "cached_books",
      60,
      JSON.stringify(mockBook)
    );
    expect(response.body).toEqual({ books: [...mockBook] });
  });
});
