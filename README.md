# Airbean-API

## HTTP anrop

## GET menu - http://localhost:8080/menu

## POST register account - http://localhost:8080/register
## JSON body:
## {
##	"username": "username",
##	"password": "password",
##	"email": "email@mail.com"
## }

## POST login - http://localhost:8080/login
## JSON body:
## {
##	"username": "username",
##	"password": "password"
## }

## POST add to cart by product id - http://localhost:8080/cart/add/:userID/:id

## DELETE from cart by product id - http://localhost:8080/cart/remove/:userID/:id

## GET cart by userId - http://localhost:8080/cart?userId=:userId

## DELETE whole cart - http://localhost:8080/cart/clear/:userId

## POST create order - http://localhost:8080/order/create/:userId

## Om man har inget konto och vill inte skapa det - används userID 'guest'