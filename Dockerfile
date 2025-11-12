# Build stage
FROM node:lts-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

# Production stage
FROM node:lts-alpine

ENV NODE_ENV=production
WORKDIR /app

RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install --frozen-lockfile --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

USER nodejs

ARG PORT=3000
EXPOSE ${PORT}

CMD ["node", "dist/src/main.js"]
