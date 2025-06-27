# Use official Node.js LTS image on Alpine Linux
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy server.js into the container
COPY server.js .

# Expose the default application port (change if your server uses a different port)
EXPOSE 3000

# Run the server
CMD ["node", "server.js"]
