# Airbean-API

## HTTP anrop

### GET menu - http://localhost:8080/menu

### GET info - http://localhost:8080/info

### POST register account - http://localhost:8080/register
### JSON body:
### {
###	"username": "username",
###	"password": "password",
###	"email": "email@mail.com"
### }

### POST login - http://localhost:8080/login
### JSON body:
### {
###	"username": "username",
###	"password": "password"
### }

### PUT update account info - http://localhost:8080/update-account
### JSON body:
### {
### "userId": "userId", (required)
###	"username": "username", (skrivs in body om man vill ändra det)
###	"password": "password", (skrivs in body om man vill ändra det)
###	"email": "email@mail.com" (skrivs in body om man vill ändra det)
### }

### POST add to cart by product id - http://localhost:8080/cart/add/:userID/:id

### DELETE from cart by product id - http://localhost:8080/cart/remove/:userID/:id

### GET cart by userId - http://localhost:8080/cart?userId=:userId

### DELETE whole cart - http://localhost:8080/cart/clear/:userId

### POST create order - http://localhost:8080/order/create/:userId

### GET order confirmation - http://localhost:8080/confirmation/:userId

### GET order history - http://localhost:8080/order-history/:userId

### Om man inte har ett konto och inte vill skapa ett - används 'guest' istället för userId