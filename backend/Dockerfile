# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --production

# Copy all backend files
COPY . .

# Expose the port your backend runs on
EXPOSE 5000

# Run the backend server
CMD ["node", "index.js"]
