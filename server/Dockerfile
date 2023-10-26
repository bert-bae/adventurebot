FROM node:18.18.0

LABEL version="1.0"
LABEL description="Backend app for haiku weather"
LABEL maintainer = ["bae.webdev@gmail.com"]

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run compile

EXPOSE 5000

CMD ["node", "./lib/src/index.js"]