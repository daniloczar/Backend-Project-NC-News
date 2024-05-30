const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const data = require("../db/data/test-data");
const endpoints = require("../endpoints.json");

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
          { slug: "mitch", description: "The man, the Mitch, the legend" },
          { slug: "cats", description: "Not dogs" },
          { slug: "paper", description: "what books are made of" },
        ]);
      });
  });
  test("404 status and responds when the path is not found", () => {
    return request(app)
      .get("/api/topic")
      .expect(404)
      .then(({ body }) => {
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
        expect(body.endpoints).toEqual(endpoints);
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

describe("GET/api/article/:articles_id", () => {
  test("Responds with the appropriate article when ID is passed", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
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
  test("returns 400 status when the article_id passed it is a different data type", () => {
    return request(app)
      .get("/api/articles/dog")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("returns 404 status when the id does not exit", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("GET/api/articles", () => {
  test("should respond with 200 status and all articles each of which include the required properties sorted by date in descending order ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.allArticles;
        expect(articles.length).toBe(13);
        expect(articles).toBeInstanceOf(Array);

        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });

  test("should respond with a 404 if given a not existent ID endpoint", () => {
    return request(app)
      .get("/api/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });

  test("400: Bad request, INVALID id", () => {
    return request(app)
      .get("/api/articles/apple")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET/api/articles/:article_id/comments", () => {
  test("Responds with an array of comments", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const result = body.comments;
        expect(Array.isArray(result)).toBe(true);
      });
  });
  test("404: responds with appropriate message when given valid but non-existent id.", () => {
    return request(app)
      .get("/api/articles/999999/comments")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Not Found");
      });
  });

  test("400: Bad request, INVALID id", () => {
    return request(app)
      .get("/api/articles/apple/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("200 and returns the comments for a determined article", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });
});

describe("POST/api/articles/:article_id/comments", () => {
  test("POST returns 201 status with the a named object containing the posted comment ", () => {
    const newComment = {
      username: "icellusedkars",
      body: "I hate streaming eyes even more",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { postComment } = body;
        expect(typeof body).toBe("object");
        expect(postComment).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: "icellusedkars",
          body: "I hate streaming eyes even more",
          article_id: 1,
        });
      });
  });

  test("POST 201: should ignore unnecessary properties in the input", () => {
    const input = {
      username: "icellusedkars",
      body: "I hate streaming eyes even more",
      tagline: "my cool comment",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(input)
      .expect(201)
      .then(({ body }) => {
        const { postComment } = body;
        expect(postComment).not.toHaveProperty("tagline");
      });
  });

  test("return a 400 status error message when new comment is passed a key with a value of the wrong data type", () => {
    const newComment = {
      username: "icellusedkars",
      body: 10,
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request");
      });
  });

  test("returns 400 error message when given an invalid id", () => {
    const newComment = {
      username: "icellusedkars",
      body: "I hate streaming eyes even more",
    };
    return request(app)
      .post("/api/articles/not-a-banana/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });

  test("responds 404 status with appropriate message when given valid but non-existent id.", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is a bad article name",
    };
    return request(app)
      .post("/api/articles/58964/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Not Found");
      });
  });

  test("404 status responds comments with invalid author should return user not found", () => {
    const newComment = {
      username: "invalid_user",
      body: "Fruit pastilles",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("User input not found");
      });
  });
});

describe("PATCH/api/articles/:article_id", () => {
  test("PATCH 200 status should update an article's vote property with POSITIVE value on the requst body ", () => {
    const articleVote = { inc_votes: 10 };

    return request(app)
      .patch("/api/articles/1")
      .send(articleVote)
      .expect(200)
      .then(({ body }) => {
        const { upArticles } = body;
        expect(upArticles).toMatchObject({
          article_id: expect.any(Number),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 110,
          article_img_url: expect.any(String),
        });
      });
  });

  test("PATCH 200 status should update an article's vote property with NEGATIVE value on the requst body ", () => {
    const articleVote = { inc_votes: -10 };

    return request(app)
      .patch("/api/articles/1")
      .send(articleVote)
      .expect(200)
      .then(({ body }) => {
        const { upArticles } = body;
        expect(upArticles).toMatchObject({
          article_id: expect.any(Number),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 90,
          article_img_url: expect.any(String),
        });
      });
  });

  test("responds 400 error message when given an invalid id", () => {
    const articleVote = { inc_vote: 10 };
    return request(app)
      .patch("/api/articles/not-a-banana")
      .send(articleVote)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });

  xtest("responds 404 error message when given a valid but non-existent id", () => {
    const articleVote = { inc_vote: 100 };
    return request(app)
      .patch("/api/articles/999999")
      .send(articleVote)
      .expect(404)
      .then(({ body }) => {
        console.log(body);
        const { msg } = body;
        expect(msg).toBe("Not found");
      });
  });
});

describe("DELETE/api/comments/:comments_id", () => {
  test("DELETE: 204 status should delete the specified comment and respond with no content", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });

  test("DELETE: 400 status respond with Bad Request when passed a invalid ID", () => {
    return request(app)
      .delete("/api/comments/not-a-banana")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });

  test("DELETE: 404 status return Comment does not exist! when passed a valid but not-exitent ID", () => {
    return request(app)
      .delete("/api/comments/222")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Comment does not exist!");
      });
  });
});

describe("GET/api/users", () => {
  test("returns a 200 status code with correct body", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });

  test("respond with a 404 error message if given an endpoint that does not exist", () => {
    return request(app)
      .get("/api/userz")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("GET /api/articles (topic query)", () => {
  test("returns a 200 status code and correct body of queried articles", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        const articles = body.allArticles;
        expect(articles).toHaveLength(1);
        articles.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
      });
  });
  test("returns a 200 status code and an empty array if valid topic is entered with no articles related to that topic", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        const articles = body.allArticles;
        expect(articles).toEqual([]);
      });
  });
  test("sends appropriate error message when the query is a topic that does not exist", () => {
    return request(app)
      .get("/api/articles?topic=9887766")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("topic not found");
      });
  });
  test("200 status responds with all articles if no topic", () => {
    const topic = "";
    return request(app)
      .get(`/api/articles?topic=${topic}`)
      .expect(200)
      .then(({ body }) => {
        const articles = body.allArticles;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles).not.toBeNull();
        articles.forEach((article) => {
          expect(article).toHaveProperty("topic");
          expect(typeof article.topic).toBe("string");
        });
        expect(articles.every((article) => article.topic !== "")).toBe(true);
         expect(articles.length).toBe(13);
      });
  });
});

describe('GET/api/articles/:article_id', () => {
   test("returns an article object by id with a comment_count property and the apropriate value", () => {
     return request(app)
    .get('/api/articles/1')
    .expect(200)
    .then(({body})=>{
      console.log(body)
        expect(body.article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: 1,
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: 11
        })
    })
  })
});