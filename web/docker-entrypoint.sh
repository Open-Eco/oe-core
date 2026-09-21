#!/bin/sh
set -e

echo "[entrypoint] Running database migrations..."
./node_modules/.bin/prisma migrate deploy

echo "[entrypoint] Starting application..."
exec node server.js
