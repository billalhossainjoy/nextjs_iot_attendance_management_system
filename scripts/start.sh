#!/bin/sh

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
while ! nc -z postgres 5432; do
  sleep 0.5
done
echo "PostgreSQL is ready!"

# Run database migrations
echo "Running database migrations..."
bunx prisma migrate deploy

# Start the Next.js application
echo "Starting the application..."
if [ "$NODE_ENV" = "production" ]; then
  bun run start
else
  bun run dev
fi 