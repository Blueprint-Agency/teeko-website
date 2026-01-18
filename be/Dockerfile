FROM node:22-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3001

# Run drizzle generate, push, seed and then start the app
CMD ["sh", "-c", "npm run db:generate && npm run db:push && npm run db:seed && npm start"]
