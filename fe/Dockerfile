FROM node:23-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Receive build arguments
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_AI_APP_URL
ARG BACKEND_URL

# Set them as environment variables for the build process
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_AI_APP_URL=$NEXT_PUBLIC_AI_APP_URL
ENV BACKEND_URL=$BACKEND_URL

RUN npm run build

CMD ["npm", "start"]
