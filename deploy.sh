#!/bin/bash

# Deployment script for Chaishots CMS

set -e  # Exit on any error

echo "Starting deployment of Chaishots CMS..."

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Build and start the services
echo "Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
echo "Waiting for services to start..."
sleep 30

# Check if services are running
echo "Checking service status..."
docker-compose ps

echo "Deployment completed successfully!"
echo ""
echo "Applications are now running:"
echo "- Admin CMS: http://localhost:3001"
echo "- API: http://localhost:3000"
echo "- Health Check: http://localhost:3000/health"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop services: docker-compose down"