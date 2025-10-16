#!/bin/bash
# Vercel build script for Vite project

echo "Starting Vercel build process..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the project
echo "Building the project..."
npm run build

echo "Build completed successfully!"