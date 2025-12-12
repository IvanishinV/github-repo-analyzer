# GitHub Repo Analyzer

A tool for analyzing GitHub repositories. The backend is a GraphQL server, and the frontend is built with React + Vite.  

This project supports both **development** and **production** modes using Docker.

---

## Project structure

```
backend/ # GraphQL server
frontend/ # React + Vite frontend
docker-compose.yml
```

---

## Requirements

- Docker ≥ 20  
- Docker Compose ≥ 1.29  
- Node.js ≥ 20 (for local development)

---

## Setting up `.env`

Create a `.env` file in the `backend` folder:

```env
GITHUB_TOKEN=your_github_token
REPO_LIST=coresponding_repos
CACHE_TTL_SECONDS=3600
```

Docker Compose automatically loads this file.

---

## How to build, run and stop

To build and start all containers:

```sh
docker-compose up --build
```

Then open:

- Frontend: http://localhost:3000

---

To stop containers:

```sh
docker-compose down
```