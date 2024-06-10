# Use the official Node.js image as a base image
FROM node:20-alpine

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy the package.json and yarn.lock files
COPY package.json yarn.lock ./

# Install app dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN yarn build

# Expose the port the app runs on
EXPOSE 8080

# Run the application
CMD ["node", "dist/index.js"]
