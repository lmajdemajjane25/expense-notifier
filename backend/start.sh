
#!/bin/bash

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    npm install
fi

# Copy environment file if it doesn't exist
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "Please edit .env file with your database credentials"
    exit 1
fi

# Start the server
npm start
