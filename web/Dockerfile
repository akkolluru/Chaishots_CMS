FROM node:18-slim

WORKDIR /app

# Copy ONLY frontend package files
COPY web/package*.json ./
RUN npm install

# Copy frontend source
COPY web/ ./

# Build frontend
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000

# If using Next.js default server
CMD ["npm", "run", "start"]