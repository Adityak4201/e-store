# APIS

DETAILS OF ALL APIS ACCORDING TO THEIR FILES

## USER.JS Requests

### ```POST /login ```

  ```     const { userEmailPhone, password } = req.body; ```
- used for logging in user . Return Jwt token and user details

### ```POST /register ```

  ```      
  roll: givenroll
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone 
   ```

    roll default value : "basic"

- used for registering user . Send Verication mail and return jwt token of newly registered user

### ```POST /getVerifyMail ```

  ``` req.body.password  ```
- used for sending verfifcation mail to user . Sends Verication mail 

### ```GET /verify```

  ```     const { userEmailPhone, password } = req.body; ```
- used for verfying user . Sets status to approved in user model.  



## PROFILE.JS Requests

### ```POST /add```

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

### ```PATCH /add/image```

  ```        
    req.file
```

- used for adding profile img of a user in folder "uploads/profile"

### ```Post /editAddress```

```        
address: req.body.address,
```

- used for editing address of a basic user.

### ```GET /getSellersCategory```

```        
address: req.body.address,
```

- return all the distinct Seller category .

### ```GET /filterBySellerCategory```

pass array of categories
```        
req.body.categories,
```

- return all the distinct Seller with same category in "categories" array .


### ```POST /message```

```        
      to: req.body.message_to,
      message: req.body.message,
```
where

message_to is username of another user to which user is messaging.

- used to message a user  .

### ```POST /userMessage```

- return all chats of a user whoever he messaged or from whoever he recived message.


### ```POST /chatWithUser```
```
req.body.username
```
- return user message to any other particular user


### ```POST /messagedBy```
- return all users who have messaged to logged in user

### ```POST /messagedTo```
- return all user who loged in user have messaged

### ```POST /addShopReview```
```
    const { shop_id, ratings, comments } = req.body;
```
- used to add review of the shop

### ```POST /getRatings```
```
    const { shop_id } = req.body;
```
- return ratings of a particular shop

### ```POST /updateShopReview```
```
    const { shop_id, ratings, comments } = req.body;
```
- to edit the rating which user had rated previously


### ```POST /cancelOrder```
```
  const { order_id, status } = req.body;
```
- cancel the status of an order by providing ```req.body.status : "cancelled" ```





