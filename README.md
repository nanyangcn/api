# Api backend

This a back end api boilerplate.

## Before All

Make sure you have Nodejs first, and before all you should run:

`$ yarn` or `$ npm install`

to install dependencies.

## Production

Before start api, you should build api first by

`$ yarn tsc` or `$ npm tsc`

To start api in production mode, please run

`$ yarn start:prod` or `$ npm start:prod`

You can also run api with Docker by

`docker run --rm -it -p 3001:3001 nanyangcn/wolt-backend`

The production mode runs in `http://localhost:3001`

## Development

Run api in development mode by

`$ yarn start:dev` or `$ npm start:dev`

to start api in development mode.

The development mode runs in `http://localhost:3001`

## Test

Run tests by

`$ yarn test` or `$ npm test`

## Lint

Run lint and fix by

`$ yarn lix` or `$ npm lint`
