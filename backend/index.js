// const express = require('express'),
//   path = require('path');

// const app = express(),
//   port = process.env.PORT || 3000;
// const dotenv = require('dotenv'),
//   { Client } = require('pg');

// dotenv.config();

// const client = new Client({
//   connectionString: process.env.PGURI,
// });

// client.connect();

// app.get('/api', async (_request, response) => {
//   try {
//     const { rows } = await client.query('SELECT * FROM cities');
//     response.send(rows);
//   } catch (error) {
//     console.error('Error executing query', error.stack);
//     response.status(500).send('Error executing query');
//   }
// });

// app.use(express.static(path.join(path.resolve(), 'dist')));

// app.listen(port, () => {
//   console.log(`Redo på http://localhost:${port}/`);
// });

// backend (Node.js)

const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const { Client } = require('pg');

// Load environment variables based on the environment
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config({ path: '.env.development' });
}

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const pool = new Client({
  connectionString: process.env.PGURI,
});

pool.connect();

// Middleware to parse JSON request bodies
app.use(express.json());

// GET all cities
app.get('/api/cities', async (_request, response) => {
  try {
    const { rows } = await pool.query('SELECT * FROM cities');
    response.send(rows);
  } catch (error) {
    console.error('Error executing query', error.stack);
    response.status(500).send('Error executing query');
  }
});

// GET a single city by ID
app.get('/api/cities/:id', async (request, response) => {
  const cityId = parseInt(request.params.id, 10);
  try {
    const { rows } = await pool.query('SELECT * FROM cities WHERE id = $1', [
      cityId,
    ]);
    if (rows.length === 0) {
      response.status(404).send('City not found');
    } else {
      response.send(rows[0]);
    }
  } catch (error) {
    console.error('Error executing query', error.stack);
    response.status(500).send('Error executing query');
  }
});

// POST a new city
app.post('/api/cities', async (request, response) => {
  const { name, population } = request.body; // Updated to use population
  try {
    const { rows } = await pool.query(
      'INSERT INTO cities (name, population) VALUES ($1, $2) RETURNING *', // Updated to use population
      [name, population]
    );
    response.status(201).send(rows[0]);
  } catch (error) {
    console.error('Error executing query', error.stack);
    response.status(500).send('Error executing query');
  }
});

// PUT (update) an existing city
app.put('/api/cities/:id', async (request, response) => {
  const cityId = parseInt(request.params.id, 10);
  const { name, population } = request.body; // Updated to use population
  try {
    const { rows } = await pool.query(
      'UPDATE cities SET name = $1, population = $2 WHERE id = $3 RETURNING *', // Updated to use population
      [name, population, cityId]
    );
    if (rows.length === 0) {
      response.status(404).send('City not found');
    } else {
      response.send(rows[0]);
    }
  } catch (error) {
    console.error('Error executing query', error.stack);
    response.status(500).send('Error executing query');
  }
});

// DELETE a city
app.delete('/api/cities/:id', async (request, response) => {
  const cityId = parseInt(request.params.id, 10);
  try {
    const { rows } = await pool.query(
      'DELETE FROM cities WHERE id = $1 RETURNING *',
      [cityId]
    );
    if (rows.length === 0) {
      response.status(404).send('City not found');
    } else {
      response.status(204).send(); // No content
    }
  } catch (error) {
    console.error('Error executing query', error.stack);
    response.status(500).send('Error executing query');
  }
});

// Serve static files from the React app
app.use(express.static(path.join(path.resolve(), 'dist')));

// Redirect any unmatched routes to the React app
app.get('*', (_req, res) => {
  res.sendFile(path.join(path.resolve(), 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
