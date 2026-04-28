const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let movies = [
  { id: 1, title: "Inception", director: "Christopher Nolan", year: 2010, genre: "Sci-Fi" },
  { id: 2, title: "The Godfather", director: "Francis Ford Coppola", year: 1972, genre: "Crime" },
  { id: 3, title: "Interstellar", director: "Christopher Nolan", year: 2014, genre: "Sci-Fi" },
];
let ratings = [];
let nextMovieId = 4;
let nextRatingId = 1;

function getAvgRating(movieId) {
  const r = ratings.filter(r => r.movieId === movieId);
  if (!r.length) return null;
  return (r.reduce((sum, r) => sum + r.score, 0) / r.length).toFixed(1);
}

// Get all movies
app.get("/movies", (req, res) => {
  let result = movies;
  if (req.query.genre) result = result.filter(m => m.genre.toLowerCase() === req.query.genre.toLowerCase());
  if (req.query.year) result = result.filter(m => m.year === parseInt(req.query.year));
  res.json(result.map(m => ({ ...m, avgRating: getAvgRating(m.id) })));
});

// Get one movie
app.get("/movies/:id", (req, res) => {
  const movie = movies.find(m => m.id === parseInt(req.params.id));
  if (!movie) return res.status(404).json({ error: "Movie not found" });
  res.json({ ...movie, avgRating: getAvgRating(movie.id) });
});

// Add a movie
app.post("/movies", (req, res) => {
  const { title, director, year, genre } = req.body;
  if (!title || !director || !year) return res.status(400).json({ error: "title, director and year required" });
  const movie = { id: nextMovieId++, title, director, year: parseInt(year), genre: genre || "Unknown" };
  movies.push(movie);
  res.status(201).json(movie);
});

// Update a movie
app.put("/movies/:id", (req, res) => {
  const movie = movies.find(m => m.id === parseInt(req.params.id));
  if (!movie) return res.status(404).json({ error: "Movie not found" });
  const { title, director, year, genre } = req.body;
  if (title) movie.title = title;
  if (director) movie.director = director;
  if (year) movie.year = parseInt(year);
  if (genre) movie.genre = genre;
  res.json(movie);
});

// Delete a movie
app.delete("/movies/:id", (req, res) => {
  const index = movies.findIndex(m => m.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Movie not found" });
  movies.splice(index, 1);
  res.json({ message: "Movie deleted" });
});

// Get ratings for a movie
app.get("/movies/:id/ratings", (req, res) => {
  const movieId = parseInt(req.params.id);
  if (!movies.find(m => m.id === movieId)) return res.status(404).json({ error: "Movie not found" });
  res.json({
    avgRating: getAvgRating(movieId),
    totalRatings: ratings.filter(r => r.movieId === movieId).length,
    ratings: ratings.filter(r => r.movieId === movieId),
  });
});

// Add a rating
app.post("/movies/:id/ratings", (req, res) => {
  const movieId = parseInt(req.params.id);
  if (!movies.find(m => m.id === movieId)) return res.status(404).json({ error: "Movie not found" });
  const { score, review } = req.body;
  if (!score || score < 1 || score > 5) return res.status(400).json({ error: "Score must be 1-5" });
  const rating = { id: nextRatingId++, movieId, score: parseInt(score), review: review || "", createdAt: new Date().toISOString() };
  ratings.push(rating);
  res.status(201).json(rating);
});

// Search movies
app.get("/search", (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Query param q required" });
  const results = movies.filter(m =>
    m.title.toLowerCase().includes(q.toLowerCase()) ||
    m.director.toLowerCase().includes(q.toLowerCase())
  );
  res.json(results);
});

app.listen(4001, () => console.log("Movie API running on http://localhost:4001"));