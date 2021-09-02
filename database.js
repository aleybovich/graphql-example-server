/* eslint-disable no-console */
const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');
const env = require('./env.json');

const seedUsers = (db, callback) => {
  const userCollection = db.collection('users');
  userCollection.insertMany([{
    email: 'user1@test.com',
    token: '676cfd35-e706-4cce-87ca-97f947c43bd4',
  }, {
    email: 'user2@test.com',
    token: '2f403473-ba0b-4ce9-be02-d1cf4ad6f453',
  }], (err, result) => {
    callback(err, result);
  });
};

(async () => {
  const mongod = await MongoMemoryServer.create({
    instance: env.local.database.instance,
  });

  const uri = mongod.getUri();
  const { port, dbPath, dbName } = mongod.instanceInfo;

  console.log(`Database uri: ${uri}`);
  console.log(`Database running on port: ${port}`);
  console.log(`Database Name: ${dbName}`);
  console.log(`Local DB Storage path ${dbPath}`);

  MongoClient.connect(uri, async (err, client) => {
    if (err) throw new Error(`Connection error: ${err}`);

    const db = client.db(dbName);
    seedUsers(db, async (error) => {
      if (error) throw new Error(`Error seeding: ${error}`);
      const users = db.collection('users').find();
      console.log('Seeded the users into users collection:');
      await users.forEach(user => console.log({ email: user.email, token: user.token }));

      client.close();
    });

    // Adding a unique index
    db.collection('userFavorites').createIndex(
      {
        email: 1,
        listingId: 1,
      },
      {
        unique: true,
      },
    );
  });
})();
