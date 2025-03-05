# Stage 1: Build the frontend
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all frontend files and build the app
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:1.23-alpine

# Copy the built files to Nginx public directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy the updated Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080
EXPOSE 8080

# Run Nginx
CMD ["nginx", "-g", "daemon off;"]
