# Build stage
FROM node:18-slim AS builder

RUN apt-get update && apt-get install -y \
    python3 \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy prisma directory first to ensure it's available for generation
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-slim

RUN apt-get update && apt-get install -y \
    libpq5 \
    python3 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install --production
RUN npm rebuild argon2

# Copy prisma directory to production stage
COPY prisma ./prisma

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "run", "start"]