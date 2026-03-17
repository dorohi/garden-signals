#!/bin/bash
set -e

SERVER="root@5.129.214.77"
APP_DIR="/opt/dacha-care"

echo "==> Deploying to $SERVER..."

ssh -o ServerAliveInterval=30 "$SERVER" bash -s << 'EOF'
set -e
cd /opt/dacha-care

echo "==> Pulling latest changes..."
git pull

echo "==> Installing dependencies..."
pnpm install

echo "==> Pushing Prisma schema..."
cd packages/db
npx prisma db push --skip-generate
npx prisma generate
cd ../..

echo "==> Building project..."
pnpm build

echo "==> Restarting server..."
pm2 restart dacha-server || pm2 start ecosystem.config.cjs

echo "==> Done! Deployment successful."
EOF
