# Push.
Send, receive and spend Minter coins with ease.

## Description

Minter Push wallet - simple light wallet
Backend part

## Installation

```bash
$ yarn install
```

## Running the app

```bash

# build app 
$ yarn build

# copy .env and ormconfig to dist forlder

# development
$ yarn start
```

## migration
```
yarn typeorm migration:generate -n InitMigration - generate new named (-n) migrations
yarn typeorm migration:run - run migration
```
