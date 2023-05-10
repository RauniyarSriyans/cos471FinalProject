# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy the rest of the application code into the container
COPY . .

# Set the environment variable to use React 18+
ENV ENABLE_NEW_JSX_TRANSFORM=true

# Build the application
RUN npm run build

# Use a lightweight web server to serve the static content
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
