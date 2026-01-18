FROM node:22-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3010

CMD ["npm", "start", "--", "-p", "3010"]
