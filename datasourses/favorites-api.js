const { DataSource } = require('apollo-datasource');

/*
We need to have two collections for storing favorites:
1. userFavorites - we store a record for each user favoring a listing. This is needed
  so that we can prevent a user from favoring the same listing more than once
2. favoriteCounts - count of likes per listing
*/

class FavoritesAPI extends DataSource {
  constructor(db) {
    super();
    this.db = db;
  }

  async addFavoriteForListing(email, listingId) {
    // Try to add a record for a user favoring a listing to userFavorites
    const userFavoritesCollection = this.db.collection('userFavorites');

    // If a record already exists, an error is thrown - a user can't like a listing twice and
    // there is a unique index on (email, listingId) enforcing that.
    try {
      await userFavoritesCollection.insertOne({ email, listingId });
    } catch (err) {
      // error code 11000 is uniqueness violation
      if (err.code === 11000) {
        throw new Error(`User ${email} has already favored listing ${listingId}`);
      }

      throw err;
    }

    const favoriteCountsCollection = this.db.collection('favoriteCounts');
    await favoriteCountsCollection.updateOne(
      { listingId },
      { $inc: { count: 1 } },
      { upsert: true },
    );
    return { success: true };
  }

  async loadFavorites(listingIds) {
    const favoritesMap = {};
    const cursors = this.db.collection('favoriteCounts').find({ listingId: { $in: listingIds } });
    await cursors
      .forEach(el => { favoritesMap[el.listingId] = el.count; });
    const result = listingIds.map(id => favoritesMap[id] || 0);
    return Promise.resolve(result);
  }
}

module.exports = FavoritesAPI;
