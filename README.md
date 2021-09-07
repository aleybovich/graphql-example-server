# GraphQL server example [![Build Status](https://app.travis-ci.com/aleybovich/graphql-example-server.svg?branch=main)](https://app.travis-ci.com/aleybovich/graphql-example-server)


## Local development

1. Install dependencies
```
yarn install
```

2. Start in-memory mongodb with seeded users
```
yarn run start:db
```
3. In another console session, run the server: 
```
yarn run start:app
```

Alternatively, you can start both the database and the server using pm2
```
node_modules/.bin/pm2 -s start database.js
node_modules/.bin/pm2 -s start index.js
```


You can use Apollo explorer to send queries to the local server: https://studio.apollographql.com/sandbox/explorer

Please note, the endpoint  requires Bearer authentication, and you can use one of the tokens seeded in `database.js` to auth as one of the users. Apollo explorer allows to specify auth header (at th ebotton of the page click "Headers" and add "Authorization":"...TOKEN...")

Sample queries: 

```
query {
  properties {
    listingId
    favoriteCount

  }
}
```

```
query {
  propertiesByCity(city: "Houston") {
    listingId
    favoriteCount 
    listPrice
    property {
      area
      bedrooms
    }
    address {
      full
    }
    disclaimer
  }
}
```

Sample mutation - adding a 'like' for a listing:

```
mutation addFavorite {
  addFavorite (listingId: "35069323") {
    success
  }
}
```

## Unit tests:
 ```
 yarn test
 ```

## Code coverage
```
yarn run coverage
```

## Functional tests:
```
yarn run func-test
```

