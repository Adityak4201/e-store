Backend for Magic Step e-Store

# APIS

DETAILS OF ALL APIS ACCORDING TO THEIR FILES

## USER.JS Requests

### `POST /login `

` const { userEmailPhone, password } = req.body;`

- used for logging in user . Return Jwt token and user details

### `POST /register `

```
roll: givenroll
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          phone: req.body.phone
```

    roll default value : "basic"

- used for registering user . Send Verication mail and return jwt token of newly registered user

### `POST /getVerifyMail `

`req.body.password `

- used for sending verfifcation mail to user . Sends Verication mail

### `GET /verify`

` const { userEmailPhone, password } = req.body;`

- used for verfying user . Sets status to approved in user model.

## PROFILE.JS Requests

### `POST /add`

```
  address: address,
  about: req.user.about,
  dob: req.body.dob,
  country: req.body.country,
  state: req.body.state,
  city: req.body.city,
```

where

```
 address = {
    Type: req.body.addressType,
    "Address ": req.body.address,
  }
```

- used for creating profile of a user .

### `PATCH /add/image`

```
  req.file
```

- used for adding profile img of a user in folder "uploads/profile"

### `Post /editAddress`

```
address: req.body.address,
```

- used for editing address of a basic user.

### `GET /getSellersCategory`

```
address: req.body.address,
```

- return all the distinct Seller category .

### `GET /filterBySellerCategory`

pass array of categories

```
req.body.categories,
```

- return all the distinct Seller with same category in "categories" array .

### `POST /message`

```
      to: req.body.message_to,
      message: req.body.message,
```

where

message_to is username of another user to which user is messaging.

- used to message a user .

### `POST /userMessage`

- return all chats of a user whoever he messaged or from whoever he recived message.

### `POST /chatWithUser`

```
req.body.username
```

- return user message to any other particular user

### `POST /messagedBy`

- return all users who have messaged to logged in user

### `POST /messagedTo`

- return all user who loged in user have messaged

### `POST /addShopReview`

```
    const { shop_id, ratings, comments } = req.body;
```

- used to add review of the shop

### `POST /getRatings`

```
    const { shop_id } = req.body;
```

- return ratings of a particular shop

### `POST /updateShopReview`

```
    const { shop_id, ratings, comments } = req.body;
```

- to edit the rating which user had rated previously

### `POST /cancelOrder`

```
  const { order_id, status } = req.body;
```

- cancel the status of an order by providing `req.body.status : "cancelled" `

## SELLERPROFILE.JS Requests

### `POST /add`

- used for creating profile of a seller user .

### `PATCH /add/image`

```
  req.file
```

- used for adding profile img of a seller user in folder "uploads/sellerprofile"

### `POSt /addStaff`

```
let { s_position, s_username, s_password } = req.body;
```

- used for adding Staff of to a seller profile

### `POST /deleteStaff`

const { s_username } = req.body;

- used for deleting Staff from a seller profile

### `GET /viewStaff`

- used for viewing Staff of a seller profile

### `POST /addAbout`

```
  const { about, return_policy } = req.body;
```

- used for adding about and return policy of a seller profile

### `GET /showAbout`

### `PATCH /showAbout`

- used for viewing about and return policy of a seller profile

### `GET /getBuyersList`

- used for viewing all buyers of a seller profile

## SELLERPRODUCTS.JS Requests

### `POST /Add`

```
    productname,
    productmetadescription,
    productdescription,
    price,
    sellprice,
    variation,
    inventory,
    Item_Returnable,
    category,
```

- used for creating product of a seller user .

### `PATCH /add/coverImage/:id`

```
req.file
```

- used for adding product img of a seller user .

### `GET /getOwnProducts`

- returns all products of a seller .

### ` GET /getByLimit`

```
req.query.page
req.query.limit
```

- return limited products for a page

### `DELETE /deleteSellerProduct/:id`

- delete a product with some id of a seller

### `POST /editProductDetails`

```
req.body.id,
and other edited parameters
```

- edit details of a product

### `POST /active/`

```
req.body.id,
req.body.active,

```

- active a product

### `POST /updateStatus/`

```
  const { order_id, status } = req.body;

```

- update a order status

## RODUCTS.JS Requests

### `GET /getProductsByLimit`

```
req.query.page
req.query.limit
```

- return limited products for a page .

### `GET /IdProduct/:id`

- return products for a id.

### `GET /SellerProduct/:username`

- return products of a particular Seller user.

### `GET /getOtherProduct`

- return products of a all other Seller user than himself

### `POST /AddToCart`

```
    const { product_id, count } = req.body;
```

- add items to the cart of a user

### `POST /RemoveFromCart`

```
    const { product_id, count } = req.body;
```

- remove items to the cart of a user

### `POST /buyProduct`

```
 all detils in shoppingModel.js Model
```

- buy Items

### `POST /addProductReview`

```
    const { product_id, ratings, comments } = req.body;

```

- add review of the item

### `POST /getRatings`

```
    const { product_id } = req.body;


```

- get ratings of a product

### `POST /updateProductReview`

```
    const { product_id, ratings, comments } = req.body;


```

- update review of a product

## VISITOR.JS Requests

### `POST /addVisitor`

```
  const { seller_username, name, product_id } = req.body;

```

- add a visitor when a user visit a product .

### `GET /getVisitors`

- get all visitor of a seeler.
