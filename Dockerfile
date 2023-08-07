# Use the official Node.js runtime as the base image
FROM node:18-alpine

# Create and set the working directory
WORKDIR /var/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port that the app will run on
EXPOSE 3000

# Set environment variables from .env file during build
ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV

ARG DATABASE_USER
ENV DATABASE_USER=$DATABASE_USER

ARG DATABASE_PASS
ENV DATABASE_PASS=$DATABASE_PASS

ARG DATABASE_HOST
ENV DATABASE_HOST=$DATABASE_HOST

ARG DATABASE_NAME
ENV DATABASE_NAME=$DATABASE_NAME

ARG DATABASE_PORT
ENV DATABASE_PORT=$DATABASE_PORT

ARG REDIS_HOST
ENV REDIS_HOST=$REDIS_HOST

ARG REDIS_PORT
ENV REDIS_PORT=$REDIS_PORT

ARG MQTT_HOST
ENV MQTT_HOST=$MQTT_HOST

ARG MQTT_PORT
ENV MQTT_PORT=$MQTT_PORT

# Build the application
RUN npm run build

# Run the application
CMD ["node", "dist/main.js"]

#docker build \
#  --build-arg NODE_ENV=dev \
#  --build-arg DATABASE_USER=postgres \
#  --build-arg DATABASE_PASS=1234 \
#  --build-arg DATABASE_HOST=localhost \
#  --build-arg DATABASE_NAME=test \
#  --build-arg DATABASE_PORT=5432 \
#  --build-arg REDIS_HOST=localhost \
#  --build-arg REDIS_PORT=6379 \
#  --build-arg MQTT_HOST=localhost \
#  --build-arg MQTT_PORT=1883 \
#  -t nestjs-app .