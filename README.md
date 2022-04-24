# REST Api - Eshop

- You can try this api on https://typescript-eshop-api.herokuapp.com/

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

### API endpoints

- to Authorize you need to add authorization header to your request ``` authorization: Bearer {{Access_token}} ```
- to choose language of response use language header ``` language: sk ```, there is support only for ```en``` and ```sk```

Auth:
- Register ``` POST /api/auth/register { "email": "admin@gmail.com", "password": "secret", "role": "ADMIN" } ```
- Login ``` POST /api/auth/login { "email": "admin@gmail.com", "password": "secret" } ```

Products:
- All products ``` GET /api/products ```
- All products with limit and page ``` GET /api/products?limit=3&page=1 ```
- All products with search ``` GET /api/products?search=mac ```
- One product ``` GET /api/products/:id ```
- Add product ``` POST /api/products { "name": "Macbook Pro 16", "price": 2500.00, "categoryID": 5 } ```
- Update product ``` PATCH /api/products/:id { "name": "Macbook Pro 14", "price": 2000.00, "categoryID": 4 } ```
- Delete product ``` DELETE /api/products/:id ```

Categories:
- All categories ``` GET /api/categories ```
- One category ``` GET /api/categories/:id ```
- Delete category ``` DELETE /api/categories/:id ```

Users:
- All users ``` GET /api/users ```
- One user ``` GET /api/users/:id ```
- My profile ``` GET /api/users/me ```
- Update my profile ``` PATCH /api/users/me { "name": "Super", "surname": "Admin", "age": 35 } ```
- Update/Upload my profile picture ``` PUT /api/users/me/picture { picture: ... } ``` Content-type: multipart/form-data

Orders:
- All orders (ADMIN), My orders (USER) ``` GET /api/orders ```
- One order ``` GET /api/orders/:id ```
- Add order ``` POST /api/orders { "address": "Košická 10, Žilina 01001",
    "phone": "0918131925",
    "products": [
        {
            "productId": 2,
            "quantity": 1
        },
        {
            "productId": 3,
            "quantity": 1
        }
    ] } ```
- Delete order (only if I created it) ``` DELETE /api/orders/:id ```
