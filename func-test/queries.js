// These queries will be used for functional testing

module.exports = {
  properties: () => `
  query {
    properties {
      listingId
      favoriteCount
  
    }
  }`,
  propertiesByCity: (city) => `
  query {
    propertiesByCity(city: "${city}") {
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
  }`,
  addFavorite: (listingId) => `
  mutation addFavorite {
    addFavorite (listingId: "${listingId}") {
      success
    }
  }`,
};
