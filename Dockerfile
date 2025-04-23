# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install deps
COPY package*.json ./
RUN npm install --force

# Copy all other files
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the default Next.js port
EXPOSE 3000
