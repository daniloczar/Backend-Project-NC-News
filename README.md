# Northcoders News API
### NC-News-Backend

NC-News is a comprehensive news application that brings you a variety range of news articles from various sources. The application provides users with up-to-date information across different categories of news around the world.
This project showcases my ability to build a full-stack application (CRUD) using modern web technologies.

### About the Project

The NC-News backend is responsible for handling data management and API endpoints. It is built with Express.js and uses PostgreSQL for the database. The backend API serves various endpoints for articles, users, comments, and votes, ensuring efficient and secure data handling.

### Hosted Version

You can have access to backend version in this [`Link`](https://backend-project-nc-news-z6wy.onrender.com)

### API Documentation

The API documentation is available in the hosted version and provides details on the available endpoints, request methods, and response formats. You can access the API documentation here: NC-News API [Documentation](./API_Doc)

### Getting Started

To get a local copy of the project up and running, follow these steps:

### Prerequisites

Make sure you have the following installed on your machine:

-   **Node.js** (minimum version 14.x)
-   **PostgreSQL** (minimum version 12.x)

### Installation

1.  **Clone the repository:**
    
    ```sh
    git clone https://github.com/daniloczar/Backend-Project-NC-News
    ```
    
2.  **Install backend dependencies:**
    
    ```sh
    npm install
    ```
    
### Setting Up the Database

1.  **Create a PostgreSQL database:**

    ```sh
    createdb database
    createdb database_test
    ```
    
2.  **Set up environment variables:**
    
    Create two `.env` files in the `root` directory:
    
    - **.env.development**
    ```sh
    PGDATABASE=your_news
    ```
    -   **.env.test**
    ```sh
    PGDATABASE=your_news_test
    ```
        
3.  **Seed the database:**
    ```sh
    npm run seed
    ```
### Running Tests

1.  **Run backend tests:**
    ```sh
    npm test
    ```
## Environment Variables

The application requires two `.env` files for different environments:

-   **.env.development:** Contains environment variables for the development environment.
-   **.env.test:** Contains environment variables for the test environment.

### Example `.env` Files

-   **.env.development**
    
    ```sh
    PGDATABASE=your_news
    PORT=9090
    ```  
-   **.env.test**
    
    ```sh
    PGDATABASE=your_news_test
    PORT=9090
    ```
### License

The NC-News App is licensed under the MIT License. See [LICENSE](https://github.com/git/git-scm.com/blob/main/MIT-LICENSE.txt) for details.

I hope you enjoy exploring the NC-News App!

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
