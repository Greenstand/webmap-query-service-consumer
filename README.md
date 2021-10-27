# Webmap Query Service Consumer

This application subscribes to specific events published by other services of Greenstand platform that allows it to build a data view of the tree tracking activity to be shown in a webmap.

## Development Environment Quick Start

1. Project Setup

Open terminal and navigate to a folder to install this project:

```
git clone https://github.com/Greenstand/webmap-query-service-consumer.git
```

Install all necessary dependencies:

```
npm install
```

2. In the command line run the following to decrypt and create `.env` file that contains connection credentials to the database and message queues this project relies on.

**Note:**
Use this command with node@12 if it does not work

```
npm run decrypt
```

The command will prompt for a password, please reach out in slack `engineering` or `microservices-working-group` channels for the credential.
On successfully running the command, the file env.secret is decrypted and creates a `.env` file.

3. Now run the app

```
node .
```

The above will start the app listening at port 3006.

### Local Database Setup - Advanced

Here are some resources to get started on local database set up and migration:

- https://postgresapp.com
- pgAdmin and DBeaver are great GUI options to use for navigating your local db
- https://www.postgresql.org/docs/9.1/app-pgdump.html

See here to learn more about db-migrate: https://db-migrate.readthedocs.io/en/latest/

#### Docker Setup

Docker can be used to streamline setting up a local db

1. Download prebuild postgis image

```
docker pull postgis/postgis
```

2. Create local data folder (use any name)

```
mkdir ~/postgres-data
```

3. Run docker image, make sure folder name matches previous step

```
docker run -d --name postgis_postgres -e POSTGRES_PASSWORD=passwrd -e POSTGRES_USER=postgres -v ~/postgres-data/:/var/lib/postgresql/data -p 5432:5432  postgis/postgis
```

4. Change this value in your env file `.env`

```
DATABASE_URL=postgresql://postgres:passwrd@0.0.0.0/postgres
```

5. Migrate database

```
npm run db-migrate
```

# How to test

## Unit test

To run the unit tests:

```
npm run test-unit
```

## Integration test

All the integration tests are located under folder `__tests__`

To run the integration test:

Run tests:

```
npm run test-integration
```

### To setup the RabbitMQ for locally integration test

(Could consider tweak this approach to run it in the Github Action for CI in the future)

To connect to the RabbitMQ locally, can use this Docker container:

```
docker run -d --hostname my-rabbit --name rabbit -p 5672:5672 -p 15672:15672  rabbitmq:3.8.9-management
```

This would run the RabbitMQ on:

```
RABBIT_MQ_URL=amqp://guest:guest@localhost
```

(The port might be 5672 as the default value)

The admin dashborad:

```
http://localhost:15672/
```

Admin user: guest:guest

## Database seeding test

In order to efficiently run our integration tests, we rely on automated database seeding/clearing functions to mock database entries. To test these functions, run:

```
npm run test-seedDB
```

## Suggestion about how to run tests when developing

There is a command in the `package.json`:

```
npm run test-watch
```

By running test with this command, the tests would re-run if any code change happened. And with the `bail` argument, tests would stop when it met the first error, it might bring some convenience when developing.

NOTE: There is another command: `test-watch-debug`, it is the same with `test-watch`, except it set log's level to `debug`.

## Postman

Can also use Postman to test the API in a more real environment. Import the API spec from [here](https://github.com/Greenstand/treetracker-wallet-api/blob/master/docs/api/spec/treetracker-token-api.yaml).

To run a local server with some seed data, run command:

```
npm run server-test
```

This command would run a API server locally, and seed some basic data into DB (the same with the data we used in the integration test).

# Contributing

Create your local git branch and rebase it from the shared master branch. Please make sure to rebuild your local database schemas using the migrations (as illustrated in the Database Setup section above) to capture any latest updates/changes.

When you are ready to submit a pull request from your local branch, please rebase your branch off of the shared master branch again to integrate any new updates in the codebase before submitting. Any developers joining the project should feel free to review any outstanding pull requests and assign themselves to any open tickets on the Issues list.
