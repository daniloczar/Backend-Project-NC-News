const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const data = require("../db/data/test-data");
const endpoints = require('../endpoints.json')

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
        expect(body.endpoints).toEqual(endpoints)
        });
    });
    test(`Status: 200, checks if the endpoints is returning a Object`, () => {
      return request(app)
        .get(`/api`)
        .expect(200)
        .then(({ body }) => {
          const { endpoints } = body;
          expect(endpoints).toBeInstanceOf(Object);
        });
    });
});

describe('GET/api/article/:articles_id', () => {
  test("Responds with the appropriate article when ID is passed", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({body}) => {
        const {article} = body
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });

});