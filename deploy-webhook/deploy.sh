#!/bin/bash
cd /opt/r2d
git pull origin master
docker compose up -d --build --force-recreate
docker image prune -f
echo "Deploy completed at $(date)"
