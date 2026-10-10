#!/bin/bash
# Development setup script for Stavely VexFlow
echo "Installing Node-gyp (node.js complier)"
npm install -g node-gyp

echo "Installing build tools and libraries for graphics and image handling"
sudo apt-get update
sudo apt-get install -y libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev
