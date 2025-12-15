#!/bin/bash
set -e

APP_NAME="picsel-backend"
BRANCH="main"

echo "=== Move to project directory ==="
cd /home/ec2-user/app/picsel-backend

echo "=== Fetch latest code ==="
git fetch origin

echo "=== Checkout main branch ==="
git checkout $BRANCH

echo "=== Pull latest changes ==="
git pull origin $BRANCH

echo "=== Install dependencies ==="
pnpm install

echo "=== Prisma generate ==="
pnpm exec prisma generate

echo "=== Build (production) ==="
pnpm build:prod

echo "=== Restart app with PM2 ==="
pm2 delete $APP_NAME || true
pm2 start dist/src/main.js --name $APP_NAME

pm2 save

echo "=== Deploy finished successfully ==="
