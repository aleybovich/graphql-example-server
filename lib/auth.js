const { AuthenticationError } = require('apollo-server-express');

// Authentication is implemented here with the assumption
// that all GraphQL requests should be authenticated.
// If we want to be able to have a mix of auth and anonymous queries/mutations,
// then we would return null as user instead of throwing auth error,
// and each individual resolver would optionally check for user not being null if auth is required
// for that resolver

const errorMessages = {
  AuthenticationRequired: 'Authentication required',
  NotSupported: 'Only Bearer authentication type is supported',
};

module.exports = {
  errorMessages,
  authenticateUser: (db, req) => {
    const authHeader = (req.headers.authorization || '');
    if (!authHeader) throw new AuthenticationError(errorMessages.AuthenticationRequired);

    const [authtype, token] = authHeader.split(' ');

    if (authtype !== 'Bearer') {
      throw new AuthenticationError(errorMessages.NotSupported);
    }

    return db.collection('users').findOne({ token });
  },
};
