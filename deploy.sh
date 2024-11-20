#!/bin/bash

REPO_DIR="/home/fongetha/cs-connections"
BRANCH="main"

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
else
    echo "No new commits."
fi
