const app = require('../app');
const request = require('supertest');
const seed = require('../db/seeds/seed');
const db = require('../db/connection');
const data = require('../db/data/test-data');

beforeEach(() => {
    return seed(data)
})
afterAll (() =>{
    return db.end()
})

describe('GET/api/topics', () => {
    test('200 status and respond with array of object with the properties Slug and Description ', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
            expect(body.ArrTopics.length).toBe(3)
            expect(body.ArrTopics).toMatchObject([
              { slug: "mitch", description: "The man, the Mitch, the legend" },
              { slug: "cats", description: "Not dogs" },
              { slug: "paper", description: "what books are made of" },
            ]);
        })
    });
});