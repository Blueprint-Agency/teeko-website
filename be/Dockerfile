FROM node:23-slim

WORKDIR /app

# Install dependencies (Layer caching)
COPY package*.json ./
RUN npm install

# Build application
COPY . .
RUN npm run build

# Content files in content/blog are imported after migrations; the import never
# blocks start-up (it only creates missing posts and always exits 0).
CMD ["sh", "-c", "npm run db:migrate && npm run content:import && npm start"]
