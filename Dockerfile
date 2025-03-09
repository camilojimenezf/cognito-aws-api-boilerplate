# Stage 1: Build the NestJS app
FROM node:18 AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Copy all files including .env
COPY . .

RUN npm run build

# Stage 2: Create a smaller image for running the app
FROM node:18-slim

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env ./.env
COPY package.json ./

EXPOSE 3000

CMD ["node", "dist/main.js"]