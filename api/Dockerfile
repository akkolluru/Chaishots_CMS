# ---------- Build stage ----------
FROM node:18-slim AS builder

RUN apt-get update && apt-get install -y \
    python3 \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy API package files
COPY api/package*.json ./
RUN npm install

# Copy prisma schema (CORRECT PATH)
COPY api/prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copy rest of API source
COPY api/ ./

# Build API
RUN npm run build


# ---------- Production stage ----------
FROM node:18-slim

RUN apt-get update && apt-get install -y \
    libpq5 \
    python3 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files again
COPY api/package*.json ./
RUN npm install --production
RUN npm rebuild argon2

# Copy prisma client
COPY api/prisma ./prisma

# Copy build output and node_modules from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "run", "start"]