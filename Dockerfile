# Use an official Node.js runtime based on Alpine for ARM64 as a parent image
FROM  --platform=arm64 node:22-alpine3.20

# Set the working directory in the container
WORKDIR /usr/src/app

# Install dependencies
RUN yarn

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["yarn", "dev"]
