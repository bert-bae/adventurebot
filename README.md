# Setting up DB

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

## Reset DB

```sh
prisma migrate reset
```

# PG Admin

Get Postgres image IPAddress

```sh
docker inspect [PostgresContainerId]  | grep IPAddress.
```

Use that IPAddress as HOST when connecting to it via PgAdmin portal.
