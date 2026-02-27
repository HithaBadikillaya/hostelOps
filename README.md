# HostelOps

**HostelOps** is a management platform designed to simplify the communication gap between students and administrators. It was built to replace clunky, outdated systems with a fast, real-time solution that actually feels good to use. 

The project features a high-end "architectural" aesthetic—minimalist theme, layouts, and smooth animations, all while keeping the code production-ready and fully containerized.

## Quick Start

Getting the project running on your local machine is simple since everything is containerized with Docker.

### 1. Prerequisites
You'll just need **Docker** and **Docker Compose** installed.

### 2. Clone the Repository
```bash
git clone <repository-url>
cd hostelOps
```

### 3. Environment Setup
Navigate to the `server` directory and create a `.env` file from the provided example:
```bash
cd server
cp .env.example .env
```
(Note: If you're on Windows, just manually copy the contents of `.env.example` into a new `.env` file.)

### 4. Launch
From the root directory, fire up the entire stack:
```bash
docker compose up --build
```
Once the build completes, head over to `http://localhost`.

---

## What’s Under the Hood?

- **Real-Time Dashboard**: An administrative console with live status updates and bento-grid analytics.
- **Architectural UI**: A custom-designed interface using Tailwind CSS, featuring floating backgrounds and a sophisticated brown/white/black palette.
- **Secure Access**: Role-based authentication (JWT) ensuring students and admins only see what they need to.
- **Full-Stack Containerization**: A robust Docker setup with an Nginx reverse proxy, making deployment to AWS or any cloud provider seamless.

### Tech Stack
- **Frontend**: React, Vite, Tailwind CSS v4
- **Backend**: Node.js, Express, MongoDB
- **Infrastructure**: Docker, Nginx
