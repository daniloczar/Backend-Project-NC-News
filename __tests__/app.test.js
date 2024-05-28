const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const data = require("../db/data/test-data");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

describe("GET/api/topics", () => {
  test("200 status and respond with array of object with the properties Slug and Description ", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.ArrTopics.length).toBe(3);
        expect(body.ArrTopics).toMatchObject([
          { slug: "mitch", 
            description: "The man, the Mitch, the legend" 
          },
          { slug: "cats",
            description: "Not dogs" 
          },
          { slug: "paper", 
            description: "what books are made of" 
          },
        ]);
      });
  });
  test("404 status and responds when the path is not found", () => {
    return request(app)
      .get("/api/topic")
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("GET/api", () => {
  test("200 status should respond with an object describing all the available endpoints on this app", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const { endPoints } = body;
        for (const value in endPoints) {
            expect(Object.keys(endPoints).length).not.toBe(0);
            expect(endPoints[value]).hasOwnProperty("description");
            expect(endPoints[value]).hasOwnProperty("queries");
            expect(endPoints[value]).hasOwnProperty("exampleResponse");
            }
        });
    });
    test(`Status: 200, checks if the endpoints is returning a Object`, () => {
      return request(app)
        .get(`/api`)
        .expect(200)
        .then(({ body }) => {
          const { endPoints } = body;
          expect(endPoints).toBeInstanceOf(Object);
        });
    });
});
