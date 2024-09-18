
# Base image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

# Client
WORKDIR /usr/src/app/client
RUN npm install
RUN npm run build

# Server
WORKDIR /usr/src/app
# Start the server using the production build
# CMD [ "node", "dist/main.js" ]
CMD [ "npm", "run", "start:prod" ]
# RUN npm run start:prod