/* eslint-disable implicit-arrow-linebreak */
module.exports = {
  Mutation: {
    addFavorite: (_, { listingId }, { dataSources, user }) =>
      dataSources.FavoritesAPI.addFavoriteForListing(user.email, listingId),
  },
  Query: {
    properties: (_, __, { dataSources }) =>
      dataSources.SimplyRetsAPI.getAllProperties(),
    propertiesByCity: (_, { city }, { dataSources }) =>
      dataSources.SimplyRetsAPI.getPropertiesByCity(city),
  },
  Listing: {
    favoriteCount: ({ listingId }, _, { dataLoaders }) =>
      dataLoaders.favorites.load(listingId),
  },
};
