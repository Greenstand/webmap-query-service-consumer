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
npm run dev
```

The above will start the app listening for RabbitMQ events.

## How To Test

To run the tests you will need an active database and RabbitMQ server. The tests will check the `.env` file for connection strings and use local defaults if none are found.

To quickly run all tests use `npm t`. For more specific test cases use `npx jest <file_path>`. Currently, testing multiple tests may fail unless run in serial with `--runInBand` or `-i`.

### Local Database Setup Using Docker

1. Download prebuilt postgis image

```
docker pull postgis/postgis
```

2. Create an empty local data folder (use any name)

```
mkdir ~/postgres-data
```

3. Run docker image, make sure the folder name matches previous step

```bash
docker run -d --name postgis_postgres -e POSTGRES_PASSWORD=password -e POSTGRES_USER=postgres -v ~/postgres-data/:/var/lib/postgresql/data -p 5432:5432  postgis/postgis
```

4. Change this value in `.env`

```
DATABASE_URL=postgresql://postgres:password@0.0.0.0/postgres
```

5. Migrate database

```bash
npm run db-migrate
```

6. Import sample data for `region`, and `region_zoom` tables

Because the `region` and `region_zoom` table is too big, it's almost impossible to
build the whole table. We copied some sample data from the real database to use for testing. Use these commands to add this data to the local test database:

```sh
DATABASE_URL=postgresql://postgres:password@0.0.0.0/postgres npm run db-seed-region
DATABASE_URL=postgresql://postgres:password@0.0.0.0/postgres npm run db-seed-region-zoom
```

### RabbitMQ Setup

To connect to the RabbitMQ locally, use this Docker container:

```bash
docker run -d --hostname my-rabbit --name rabbit -p 5672:5672 -p 15672:15672  rabbitmq:3.8.9-management
```

Use this env variable to connect to the server. This will use the default port (5672)

```
RABBITMQ_URL=amqp://guest:guest@localhost
```

The admin dashborad:

```
http://localhost:15672/
```

Admin user: guest:guest

# Contributing

Create your local git branch and rebase it from the shared master branch. Please make sure to rebuild your local database schemas using the migrations (as illustrated in the Database Setup section above) to capture any latest updates/changes.

When you are ready to submit a pull request from your local branch, please rebase your branch off of the shared master branch again to integrate any new updates in the codebase before submitting. Any developers joining the project should feel free to review any outstanding pull requests and assign themselves to any open tickets on the Issues list.
