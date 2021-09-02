const axios = require('axios');
const { properties, propertiesByCity, addFavorite } = require('./queries');

const graphUrl = 'http://localhost:4000/graphql';

function getAllProperties() {
  const data = { query: properties() };

  return axios({
    url: graphUrl,
    method: 'post',
    data,
    headers: { Authorization: 'Bearer 676cfd35-e706-4cce-87ca-97f947c43bd4' },
  });
}

function getHoustonProperties() {
  const data = { query: propertiesByCity('Houston') };

  return axios({
    url: graphUrl,
    method: 'post',
    data,
    headers: { Authorization: 'Bearer 676cfd35-e706-4cce-87ca-97f947c43bd4' },
  });
}

function addFavoriteProperty(listingId) {
  const data = { query: addFavorite(listingId) };

  return axios({
    url: graphUrl,
    method: 'post',
    data,
    headers: { Authorization: 'Bearer 676cfd35-e706-4cce-87ca-97f947c43bd4' },
  });
}

describe('functional tests', () => {
  it('get all properties', async () => {
    expect.assertions(1);
    const res = await getAllProperties();

    expect(res.data.data.properties).toHaveLength(20);
  });

  it('get Houston properties', async () => {
    expect.assertions(1);
    const res = await getHoustonProperties();

    expect(res.data.data.propertiesByCity).toHaveLength(12);
  });

  it('add a favorite', async () => {
    // Get Houston properties and grab the first one's listingId,
    // making sure there are no favorites yet
    expect.assertions(4);
    let props = (await getHoustonProperties('Houston')).data.data.propertiesByCity;

    expect(props[0].favoriteCount).toBe(0);
    const { listingId } = props[0];

    // Add a favorite for the first listing
    const res = await addFavoriteProperty(listingId);

    expect(res.data.data.addFavorite.success).toBe(true);

    // Now we need to grab the properties and make sure favoritesCount for listingId is 1
    props = (await getHoustonProperties('Houston')).data.data.propertiesByCity;
    const property = props.find(p => p.listingId === listingId);

    expect(property).not.toBeNull();
    expect(property.favoriteCount).toBe(1);
  });

  it('fail to like the same listing the second time', async () => {
    expect.assertions(3);

    // Retrieve the list of properties in Houston
    const props = (await getHoustonProperties('Houston')).data.data.propertiesByCity;

    // The user has already liked the first property in the previous test
    expect(props[0].favoriteCount).toBe(1);
    const { listingId } = props[0];

    // Lets try to like the saame property again
    const res = await addFavoriteProperty(listingId);

    expect(res.data.errors).toHaveLength(1);
    expect(res.data.errors[0].message).toBe(`User user1@test.com has already favored listing ${listingId}`);
  });
});
