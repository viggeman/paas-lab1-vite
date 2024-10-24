# Project Documentation

## Overview

This is a school project consisting of a frontend built with React and Vite, and a backend built with Node.js and Express.

## Project Structure

```
root/
  backend/
    files
  frontend/
    files
```

### Backend

The backend is a Node.js application using Express.

#### Scripts

- build-frontend: Builds the frontend and moves the dist folder to the backend.
- dev: Starts the backend in development mode using nodemon.

### Frontend

The frontend is a React application using Vite.

#### Scripts

- dev: Starts the frontend in development mode using Vite.
- build: Builds the frontend for production.
- lint: Runs ESLint to check for code quality issues.
- preview: Previews the production build.

## Running the Project

### Backend

1. Install dependencies: `npm install`
2. Run the build script: `npm run build-frontend`
   _(This will build the frontend and move the dist folder to the backend.)_
3. Start the backend: `npm run dev`

### Frontend

1. Install dependencies: `npm install`
2. Start the frontend: `npm run dev`
