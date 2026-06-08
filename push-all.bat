@echo off
echo Pushing to personal repo (origin)...
git push origin main

echo Pushing to project repo (ml-model branch)...
git push project main:ml-model

echo Done! Pushed to both remotes.