# Stage 1: build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY src ./src
COPY tsconfig.json ./
RUN npm run build

# Stage 2: production
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package.json package-lock.json* ./
RUN npm install --production
EXPOSE 4000
CMD ["node", "dist/index.js"]
