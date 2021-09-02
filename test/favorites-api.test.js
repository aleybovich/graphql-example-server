const FavoritesApi = require('../datasourses/favorites-api');

const makeCollection = (userFavoritesCollection, favoriteCountsCollection) => jest.fn((name) => {
  if (name === 'userFavorites') return userFavoritesCollection;
  if (name === 'favoriteCounts') return favoriteCountsCollection;
  throw Error(`Wrong collection name ${name}`);
});

class MongoError11000 extends Error {
  constructor() {
    super();
    this.code = 11000;
  }
}

describe('favorites api', () => {
  it('fail because user already favored the listing', async () => {
    expect.assertions(2);
    const userFavoritesCollection = {
      insertOne: jest.fn(async () => { throw new MongoError11000(); }),
    };

    const collection = makeCollection(userFavoritesCollection, null);
    const db = { collection };

    const favoritesApi = new FavoritesApi(db);

    let error = null;
    try {
      await favoritesApi.addFavoriteForListing('some@email', 'some-listingId');
    } catch (e) {
      error = e;
    }

    expect(error).not.toBeNull();
    expect(error.message).toMatch('User some@email has already favored listing some-listingId');
  });

  it('fail because of some mongodb error', async () => {
    expect.assertions(2);
    const userFavoritesCollection = {
      insertOne: jest.fn(async () => { throw new Error('Some other error'); }),
    };

    const db = { collection: makeCollection(userFavoritesCollection, null) };

    const favoritesApi = new FavoritesApi(db);

    let error = null;
    try {
      await favoritesApi.addFavoriteForListing('some@email', 'some-listingId');
    } catch (e) {
      error = e;
    }

    expect(error).not.toBeNull();
    expect(error.message).toMatch('Some other error');
  });

  it('successfully increase favroite count', async () => {
    expect.assertions(4);

    const updateOne = jest.fn();

    const userFavoritesCollection = { insertOne: jest.fn() };
    const favoriteCountsCollection = { updateOne };

    const db = { collection: makeCollection(userFavoritesCollection, favoriteCountsCollection) };

    const favoritesApi = new FavoritesApi(db);

    await favoritesApi.addFavoriteForListing('some@email', 'some-listingId');

    expect(updateOne.mock.calls).toHaveLength(1);

    // Test first arg to updateOne
    expect(updateOne.mock.calls[0][0]).toStrictEqual({ listingId: 'some-listingId' });
    // Test second arg to updateOne
    expect(updateOne.mock.calls[0][1]).toStrictEqual({ $inc: { count: 1 } });
    // Test third arg to updateOne
    expect(updateOne.mock.calls[0][2]).toStrictEqual({ upsert: true });
  });
});
