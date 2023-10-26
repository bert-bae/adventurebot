FROM node:18.18.0

LABEL version="1.0"
LABEL description="Frontend app for haiku weather"
LABEL maintainer = ["bae.webdev@gmail.com"]

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

RUN npm install -g serve
CMD ["serve", "-s", "build"]