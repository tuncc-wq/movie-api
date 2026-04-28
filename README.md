# Movie Rating API

A REST API for managing movies and ratings.

## Live API
movie-api-production-0bf8.up.railway.app

## Endpoints
GET    /movies              → get all movies
GET    /movies/:id          → get one movie
POST   /movies              → add a movie
PUT    /movies/:id          → update a movie
DELETE /movies/:id          → delete a movie
POST   /movies/:id/ratings  → rate a movie
GET    /movies/:id/ratings  → get ratings
GET    /search?q=           → search movies

## Tech
- Node.js + Express
- Deployed on Railway
