#!/bin/bash
set -e

echo "Installing dependencies..."
npm install

echo "Generating Prisma client..."
npx prisma generate

echo "Running migrations..."
npx prisma migrate dev --name init

echo "Migration completed!"