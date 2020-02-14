# Push.
Light web wallet to send, receive and spend Minter coins with ease. Powered by <a href="https://github.com/MinterTeam" target="_blank">Minter blockchain</a>.

## Description

Push is a light web-app wallet to get access to it a user only need to know a unique URL address, we also call is a link-wallet. The main advantage of a link-wallet is the ease of getting access to it and start spending with no sign up, no login, no registration, no password or whatever. 

Although the link-wallet app has advanced options for users that wish to create multiple wallets and run commercial campaigns. The app offers to users different modes and scenarios that could be applied to big variety of private and commercial cases.

### Modes and usage scenarios

## Backend part
Deploy you copy on server or use our public api - `https://p.motherminter.org/api/`<br>
Backend - is'a <a href=https://nestjs.com/>NestJS</a> app starting on **3048** port <br>

### Installation and running
```bash
git clone https://github.com/MotherMinter/Push.git
cd Push
yarn install && yarn build

# copy .env and ormconfig to dist forlder and fill them
cp .env.example ./dist/.env
cp ormconfig.json.example ./dist/ormconfig.json

# run DB migrations
yarn typeorm migration:run

# run backend API
cd dist
node ./src/main.js

# or use pm2
pm2 start ./src/main.js
```

## Frontend part
Frontend - is a simple <a href="https://nuxtjs.org/">NuxtJS</a> application by light wallet technology starting on **30480** port<br>

### Installation and running

```bash
# build app 
cd www
yarn install && yarn build 

# run 
yarn start

# or use pm2
pm2 start npm --name "nuxt" -- start
```

## API Description
Project exists Swagger api doc on `https://<your_host>:3048/docs/` . 
You may use it for test you backend.

##### 1. Create company
```
POST /api/company

Params - json object (may be empty or contain parameters)
{
    "type": "complex|complex_feedback|complex_action|simple_feedback|simple_action|simple",
    "email": "any@email.mn",
    "password": "any_company_password",
    "protected": 0/1,
    "params": {
        "count": 3,
        "amount": "3.0",
        "symbol": "BIP",
        "title": "hello_msg in wallet interface",
        "notice": "activation task message",
        "callback_link": "https://you_backend_for_reply.mn/",
    }
}

type - company type
email|password - use'it to auth in company stat's
count - count of wallet any Number or 0 if you create unlim company
protected - flag - True if wallet have a password
callback_link - used for feedback|action company
``` 

##### 2. "One more wallet" link for Unlim company
```
GET /api/company/{company_uid}/get_wallet?count=N

N - count of new wallet you need
```

##### 3. Get wallet information
Check if wallet exist and return info and status (need activate, need password)
```
GET /api/{wallet_uid}
```

##### 4. Try login or activate wallet
Wallet interface calculate address from (uid and password if exist) and send it to back, server check it and return success or fail.

```
POST /api/{wallet_uid}

Params
{
    "mxaddress": "Mx000...",
    "custom": 1/0, 
}

custom - flag if it address is custom type 
``` 

##### 5. Before/After activate
This request's used for feedback/action wallet type
```
POST /api/{wallet_uid}/complex

Params
{
    "mxaddress": "Mx000...",
}

Return wallet initial balance and task for activation
```

```
POST /api/{wallet_uid}/after

Params 
{
    "mxaddress": "Mx000...",
}

Return message to user
```

##### 6. Send reply for complex type
Store user reply to DB and activate wallet if need

```
POST /api/{wallet_uid}/reply

Params
{
    "mxaddress": "Mx000...",
    "reply": "user reply message or review or action",
}
``` 

##### 7. Send signed raw transaction to network
All transaction created and signed in wallet interface (on client side)

```
POST /api/{wallet_uid}/send

Params
{
    "mxaddress": "Mx000...",
    "rawTx": "0x.....",
}

mxaddress - used for auth request
rawTx - hex of signed transaction
```
