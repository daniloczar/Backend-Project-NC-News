# API documentation
Working in progress....

### Endpoints

- responds with a list of available endpoints
```js
GET /api
```
- responds with a list of articles
```js
GET /api/articles
```
- responds with a single article by article_id
```js
GET /api/articles/:article_id
```
- responds with a list of comments by article_id
```js
GET /api/articles/:article_id/comments
```
- responds with a list of topics
```js
GET /api/topics
```
- responds with a list of users
```js
GET /api/users
```
- add a comment by article_id
```js
POST /api/articles/:article_id/comments
```
- updates an article by article_id
```js
PATCH /api/articles/:article_id
```
- deletes a comment by comment_id
```js
DELETE /api/comments/:comment_id
```
- allows articles to be filtered and sorted
```js
GET /api/articles (queries)
```
- adds a comment count to the response when retrieving a single article
```js
GET /api/articles/:article_id (comment count)
```
