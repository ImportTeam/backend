#!/bin/bash
set -e

APP_NAME="picsel-backend"

echo "=== Git Pull ==="
git pull origin main

echo "=== Install Dependencies ==="
pnpm install --frozen-lockfile

echo "=== Prisma Generate ==="
pnpm prisma generate

echo "=== Build (Production) ==="
pnpm build:prod

echo "=== Restart App (PM2) ==="
pm2 delete $APP_NAME || true
pm2 start dist/src/main.js --name $APP_NAME

pm2 save

echo "=== Deploy Finished ==="
