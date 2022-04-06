# REST Api - Eshop  

### Requirements

- node.js ^12.14.0
- postgres ^11.5
- favourite IDE
- git

### How to start

- fork or download this repository
- install dependencies with `npm i`
- create eshop database (application access `postgresql://localhost:5432/eshop`, make sure you use correct port and db name )
- create db schema and populate db with `npm run seed`
- create .env file and add ``` TOKEN_SECRET= ``` and ``` REFRESH_SECRET= ``` inorded to encrypt JWT token
- run express server with `npm start`

### My notes

- Authorization system is based on JWT 