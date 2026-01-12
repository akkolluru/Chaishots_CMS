FROM node:18-slim

# Install dependencies for native packages
RUN apt-get update && apt-get install -y \
    python3 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

# Install all dependencies
RUN npm install

COPY . .

# Build the application
RUN npm run build

EXPOSE 3001

# Use the custom server that respects PORT environment variable
CMD ["node", "server.js"]