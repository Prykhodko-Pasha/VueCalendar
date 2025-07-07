#!/bin/bash

# Build the project
echo "Building the project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "Build successful! Files are ready in the dist/ directory."
    echo "You can now deploy the contents of dist/ to your web server."
    echo ""
    echo "For GitHub Pages:"
    echo "1. Push your code to GitHub"
    echo "2. Go to Settings > Pages"
    echo "3. Set source to 'GitHub Actions'"
    echo "4. The workflow will automatically deploy your app"
else
    echo "Build failed! Please check the error messages above."
    exit 1
fi 