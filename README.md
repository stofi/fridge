## Getting Started

# Install your dependencies

```
npm install
```


# Setup environment

```
# .env
# Mongodb connection URI
MONGODB_URL="mongodb://localhost:27017/fridge"

# URI for testing database
MONGODB_TEST_URL="mongodb://localhost:27017/fridge-test"

# Port for the node.js server
PORT=3030
```


# Start your app

```
npm start
```


## Creating a new user

POST a json object to /users
```
{
  "email": "user@example.com",
  "password": "secretpassword",
  "username": "username"
}
```

Or with the application running on localhost:3030
```
./bin/addUser user@example.com secretpassword username
```


## Testing

Simply run `npm test` and all your tests in the `test/` directory will be run.
