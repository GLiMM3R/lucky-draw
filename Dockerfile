# Base image
FROM node:18.17.0-alpine

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
# RUN npm ci --only=production
RUN npm ci

# Bundle app source
COPY . .

# Prisma generate
RUN npm run prisma

# Creates a "dist" folder with the production build
RUN npm run build

EXPOSE 3000

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
