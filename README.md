# Vanilla JS Router with Vite & Docker

A minimal client-side router built in pure JavaScript, using `window.location.hash` and modular route files, 
powered by [Vite](https://vitejs.dev) for fast development and bundled production, and deployable via Docker.

## Features

- Hash-based routing (`#/home`, `#/about`, etc.)
- Modular route system (one file per route)
- Per-route lifecycle support (e.g. `onLoad`, `cleanup`)
- Built with Vite for lightning-fast development
- Dockerized for easy deployment

---

## Local Development

1. Install dependencies:

```bash
npm install
````

2. Start development server:

```bash
npm run dev
```

3. Open your browser:

```
http://localhost:5173/
```

---

## Deploy with Docker

### Build the Docker image

```bash
docker build -t vanilla-js-router .
```

### Run the container

```bash
docker run -d -p 8080:80 vanilla-js-router
```

Then open:

```
http://localhost:8080
```

> Docker uses a multi-stage build:
>
> * **Stage 1**: Uses Node.js to install deps and build via Vite
> * **Stage 2**: Serves static files with Nginx

