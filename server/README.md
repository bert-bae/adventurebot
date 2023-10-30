# Setup

The server requires the following to be setup:

1. NodeJs v18.16.0
2. Docker to run Postgresql via the `docker-compose.yml` at the root
3. Temporal CLI

To run the application:

1. Install dependencies with `npm i`
2. Copy and configure `.env.template` to `.env`
3. Run postgres with `docker compose up` at the root
4. Run temporal with `temporal server start-dev`
5. Start server with `npm run dev`

## Setting up DB

1. Install Prisma

```sh
npm i -g prisma
```

2. Enter server folder

```sh
cd ./server
```

3. Run migration

```sh
prisma migrate dev
```

#### Reset DB

```sh
prisma migrate reset
```

## PG Admin

Get Postgres image IPAddress

```sh
docker inspect [PostgresContainerId]  | grep IPAddress.
```

Use that IPAddress as HOST when connecting to it via PgAdmin portal.

## Setting up Temporal

1. Install the temporal CLI by following instructions (here)[https://docs.temporal.io/dev-guide/typescript/foundations#run-a-development-server]
2. Start the temporal server using `temporal server start-dev`
