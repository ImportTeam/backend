# Build stage
FROM node:lts-alpine AS builder

USER node
WORKDIR /home/node

COPY --chown=node:node package.json pnpm-lock.yaml .
RUN npm install -g pnpm && pnpm install

COPY --chown=node:node . .
RUN pnpm run build && pnpm prune --omit=dev

# Production stage
FROM node:lts-alpine

ENV NODE_ENV=production
USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/package.json .
COPY --from=builder --chown=node:node /home/node/pnpm-lock.yaml .
COPY --from=builder --chown=node:node /home/node/node_modules ./node_modules
COPY --from=builder --chown=node:node /home/node/dist ./dist
COPY --from=builder --chown=node:node /home/node/prisma ./prisma

ARG PORT=3000
EXPOSE ${PORT}

CMD ["node", "dist/main.js"]
