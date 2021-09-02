const { authenticateUser, errorMessages } = require('../lib/auth');

describe('authentication module', () => {
  it('authentication fails if no authorization header in request', () => {
    expect.assertions(1);
    const req = { headers: {} };
    expect(() => authenticateUser(null, req)).toThrow(errorMessages.AuthenticationRequired);
  });

  it('authentication fails if it is not Bearer auth', () => {
    expect.assertions(1);
    const req = { headers: { authorization: 'Basic SOMETHING' } };
    expect(() => authenticateUser(null, req)).toThrow(errorMessages.NotSupported);
  });

  it('user is returned if Bearer authentication provided', () => {
    expect.assertions(1);
    const req = { headers: { authorization: 'Bearer SOME-TOKEN' } };
    const findOne = jest.fn(({ token }) => ({ email: 'name@provider.com', token }));

    const db = { collection: () => ({ findOne }) };

    const user = authenticateUser(db, req);

    expect(user).toStrictEqual({ email: 'name@provider.com', token: 'SOME-TOKEN' });
  });
});
