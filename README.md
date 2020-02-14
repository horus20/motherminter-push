<img style="width:10px !important; max-width: none;" src="https://github.com/MotherMinter/Push/blob/master/www/static/push_logo.svg" alt="Push.">

# Push.
Send, receive and spend Minter coins with ease. Powered by <a href="https://github.com/MinterTeam" target="_blank">Minter blockchain</a>.

## Description

Push is a light web-app wallet to get access to it a user only need to know a unique URL address, also call a link-wallet. The main advantage of a link-wallet is the ease of getting access to it and start spending with no sign up, no login, no registration, no password or whatever. 

Although the link-wallet app has advanced options for users that wish to create multiple wallets and run commercial campaigns. The app offers to users different modes and scenarios that could be applied to big variety of private and commercial cases.

### Modes and usage scenarios

#### One wallet mode

<b>`Simple.`</b> The app creates a unique URL-wallet for a user. Anyone who knows the URL gets access to a balance. The user is able to attach a message or set a password to the link-wallet if they want. In this case a recipient will need to know the URL and the password. Also a user may customise the wallet by picking an envelope for it from the preset skins.

<b>`Feedback.`</b> The scenario in which the wallet user, before gaining access to it, must leave some kind of feedback: review, opinion, suggestion, recommendation, consultation or other valuable information. After filling out the form and submitting it, the user gets access to the balance. The user's feedback is sent to the creator email 
address.

<b>`Action.`</b> In this scenario, the user must complete a task and fill out a form with proof of its completion before accessing the link-wallet. The task to be performed is described by the creator in the step of wallet generation. For example: repost, like, comment, or other action. The result of the user’s action is sent to the creator email address.

* In One wallet mode, a link-wallet is sent from one user to another (one-to-one), which most likely implies the presence of acquaintance between the participants in the process, or the presence of a basic level of trust. Obviously, these cases do not require an advanced level of validation of actions, a useful action will be performed efficiently due to the mutual interest of the parties.

#### Multiple wallet mode

A user have to signup and login into the account to be able to create multiple wallet campaigns. 
They will be offered to specify:

* A number of wallets to generate (fixed or unlimited)
* Indicate one wallet balance 
* Indicate target spending 
* Attach message (in simple mode)
* Attach feedback request (in feedback mode)
* Pick up skins (in simple mode)
* Import email database to generate wallets for it
* Send wallets to imported email database
* Export or copy a generated list of link-wallets
* Track statistics

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
