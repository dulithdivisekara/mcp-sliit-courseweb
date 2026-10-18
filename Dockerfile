# Dockerfile for SLIIT Courseweb MCP Server
# Compatible with Glama.ai MCP container introspection

FROM node:20-slim AS builder

WORKDIR /app

# Copy package definitions and TypeScript config
COPY package*.json tsconfig.json ./

# Install dependencies and build TypeScript
RUN npm install
COPY src ./src
RUN npm run build

# Production image
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HEADLESS=true

COPY package*.json ./
RUN npm install --omit=dev

# Copy compiled artifacts from builder
COPY --from=builder /app/build ./build

# MCP server communicates over standard I/O (stdio)
ENTRYPOINT ["node", "build/index.js"]
