const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const { Client } = require('pg');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const client = new Client({
  connectionString: process.env.PGURI,
});

client.connect();

app.use(express.json());

// GET *
app.get('/api/cities', async (_request, response) => {
  try {
    const { rows } = await client.query('SELECT * FROM cities');
    response.status(200).send(rows);
  } catch (error) {
    console.error('Error executing query', error.stack);
    response.status(500).send('Error executing query');
  }
});

// GET by ID
app.get('/api/cities/:id', async (request, response) => {
  const cityId = parseInt(request.params.id, 10);
  try {
    const { rows } = await client.query('SELECT * FROM cities WHERE id = $1', [
      cityId,
    ]);
    if (rows.length === 0) {
      response.status(404).send('City not found');
    } else {
      response.status(200).send(rows[0]);
    }
  } catch (error) {
    console.error('Error executing query', error.stack);
    response.status(500).send('Error executing query');
  }
});

// POST
app.post('/api/cities', async (request, response) => {
  const { name, population } = request.body;
  try {
    const { rows } = await client.query(
      'INSERT INTO cities (name, population) VALUES ($1, $2) RETURNING *',
      [name, population]
    );
    response.status(201).send(rows[0]);
  } catch (error) {
    console.error('Error executing query', error.stack);
    response.status(500).send('Error executing query');
  }
});

// PUT
app.put('/api/cities/:id', async (request, response) => {
  const cityId = parseInt(request.params.id, 10);
  const { name, population } = request.body;
  // Early return for invalid cityId
  if (isNaN(cityId)) {
    response.status(400).send('City ID must be a number');
    return;
  }
  try {
    const { rows } = await client.query(
      'UPDATE cities SET name = $1, population = $2 WHERE id = $3 RETURNING *',
      [name, population, cityId]
    );
    if (rows.length === 0) {
      response.status(404).send('City not found');
    } else {
      response.status(200).send(rows[0]);
    }
  } catch (error) {
    console.error('Error executing query', error.stack);
    response.status(500).send('Error executing query');
  }
});

// DELETE
app.delete('/api/cities/:id', async (request, response) => {
  const cityId = parseInt(request.params.id, 10);
  if (isNaN(cityId)) {
    response.status(400).send('City ID must be a number');
    return;
  }
  try {
    const { rows } = await client.query(
      'DELETE FROM cities WHERE id = $1 RETURNING *',
      [cityId]
    );
    if (rows.length === 0) {
      response.status(404).send('City not found');
    } else {
      response.status(200).send(rows[0]);
    }
  } catch (error) {
    console.error('Error executing query', error.stack);
    response.status(500).send('Error executing query');
  }
});

app.use(express.static(path.join(path.resolve(), 'dist')));

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
