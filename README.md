# Attendance Management System

A modern attendance management system built with Next.js, Prisma, and PostgreSQL.

## Docker Setup

This project uses Docker Compose to set up a development environment with PostgreSQL.

### Prerequisites

- Docker and Docker Compose installed on your machine

### Getting Started

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd attendance-management
   ```

2. Create a `.env` file:

   ```bash
   cp .env.example .env
   ```

   Update the environment variables in `.env` file with your own configuration.

3. Start the Docker containers:

   ```bash
   docker compose up
   ```

   This will start both the PostgreSQL database and the web application.

4. Access the application:

   Once the containers are running, you can access the application at http://localhost:3000

### Development Workflow

- The application code is mounted as a volume, so any changes you make to the code will be reflected immediately.
- The database is persisted in a Docker volume called `postgres-data`.

### Running Commands

To run commands in the web container:

```bash
docker compose exec web <command>
```

For example, to run Prisma migrations:

```bash
docker compose exec web bunx prisma migrate dev
```

## Database Management

### Viewing Database Data

You can connect to the PostgreSQL database using any PostgreSQL client with these credentials:

- Host: localhost
- Port: 5432
- Username: postgres
- Password: postgres
- Database: attendance

### Running Migrations

To create and apply new migrations:

```bash
docker compose exec web bunx prisma migrate dev --name <migration-name>
```

## Stopping the Application

To stop the application and preserve the data:

```bash
docker compose down
```

To stop the application and remove all data:

```bash
docker compose down -v
```
