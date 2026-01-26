FROM node:23-slim

WORKDIR /app

# Install dependencies (Layer caching)
COPY package*.json ./
RUN npm install

# Build application
COPY . .
RUN npm run build

CMD ["sh", "-c", "npm run db:push && npm start"]
