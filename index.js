/* eslint-disable no-console */
/* eslint-disable implicit-arrow-linebreak */
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { MongoClient } = require('mongodb');
const DataLoader = require('dataloader');
const typeDefs = require('./types/schema');
const resolvers = require('./resolvers');
const FavoritesAPI = require('./datasourses/favorites-api');
const SimplyRetsAPI = require('./datasourses/simplyrets-api');
const auth = require('./lib/auth');

const connectionParams = require('./env.json').local.database.instance;

const mongoUri = `mongodb://${connectionParams.ip}:${connectionParams.port}/`;
const { dbName } = connectionParams;

const app = express();

(async () => {
  const client = await MongoClient.connect(mongoUri);
  const db = client.db(dbName);

  const favoritesApi = new FavoritesAPI(db);

  const dataLoaders = {
    favorites: new DataLoader(favoritesApi.loadFavorites.bind(favoritesApi), { cache: false }),
  };

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
      FavoritesAPI: favoritesApi,
      SimplyRetsAPI: new SimplyRetsAPI(),
    }),
    // Note: context creating will fail if the request is not authenticated
    context: async ({ req }) => ({ user: await auth.authenticateUser(db, req), dataLoaders }),
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: '/graphql' });

  const server = app.listen({ port: 4000 }, () =>
    console.log('Listening on http://localhost:4000/graphql'));

  server.on('close', async () => {
    console.log(' Stopping ...');
    if (client) await client.close();
  });

  process.on('SIGINT', () => {
    server.close();
  });

  process.on('SIGTERM', () => {
    server.close();
  });
})();
