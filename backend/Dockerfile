# Use official Node.js image as a base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port (default for Node.js)
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
