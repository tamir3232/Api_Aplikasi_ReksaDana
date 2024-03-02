FROM node:16

WORKDIR /app

# Get the package.json first to install dependencies
COPY package.json /app

RUN apt-get update -y && apt-get install -y \
    nano \
    net-tools

# Copy the rest of the app to the working directory
COPY . /app