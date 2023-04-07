# nuxt-durable-object

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```sh
yarn install
```

## Deploy to Cloudflare

### Install [wrangler](https://github.com/cloudflare/workers-sdk), login and publish to your Cloudflare account

```sh
npm install -g wrangler
wrangler login
```

```sh
wrangler publish
```

## Helpful Wrangler Commands

```bash
# Outputs a list of all KV namespaces associated with your account id.
wrangler kv:namespace list
# Create a KV namespace with Wrangler
wrangler kv:namespace create <YOUR_NAMESPACE>
# Outputs a list of all keys in a given namespace.
wrangler kv:key list --binding=WORKERS_APOLLO_CACHE
wrangler kv:key list --binding=WORKERS_APOLLO_CACHE --env production
wrangler kv:key list --binding=WORKERS_APOLLO_CACHE --prefix="user:1"
# Create or replace a secret
wrangler secret put JWT_SECRET
wrangler secret put <name> --env ENVIRONMENT_NAME
# Durable Object migration
wrangler publish --new-class <ClassName> --env ENVIRONMENT_NAME
wrangler publish --delete-class <ClassName>
# Publish Worker
wrangler publish --env production
```

`headers: Object.fromEntries(request.headers)`

## d1 Database

### Create a new D1 database
```sh
wrangler d1 create <database-name>
```

### Create a migration
```sh
wrangler d1 migrations create <DATABASE_NAME> "<MIGRATION_FILENAME>"
```

### List migrations
```sh
wrangler d1 migrations list <DATABASE_NAME>
```

### Apply migrations
```sh
wrangler d1 migrations apply <DATABASE_NAME>
```

### Execute query
```sh
wrangler d1 execute <DATABASE_NAME> --command "<SQL_QUERY>"
```

## Helpful SQL Command

Import/export tips
(https://stackoverflow.com/questions/44015692/access-denied-you-need-at-least-one-of-the-super-privileges-for-this-operat)