#!/bin/bash

REPO_DIR="/home/fongetha/cs-connections"
BRANCH="main"
LOG_FILE="/home/fongetha/cs-connections/daily_deploy_cron.log"

# Write the timestamp
echo "----- $(date) -----" >> "$LOG_FILE"

cd $REPO_DIR

# Fetch changes
git fetch origin $BRANCH

# Check for updates from remote
LOCAL=$(git rev-parse $BRANCH)
REMOTE=$(git rev-parse origin/$BRANCH)

if [ $LOCAL != $REMOTE ]; then
    echo "New commits detected. Deploying..."
    git reset --hard origin/$BRANCH
    npm install
    rm -rf dist
    npm run build
    sudo systemctl restart apache2
    echo "Deployment completed successfully!" >> "$LOG_FILE"
else
    echo "No new commits." >> "$LOG_FILE"
fi
