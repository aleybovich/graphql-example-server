/* eslint-disable class-methods-use-this */
const { RESTDataSource } = require('apollo-datasource-rest');

class SimplyRetsAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://api.simplyrets.com/properties';
  }

  willSendRequest(request) {
    const encodedCreds = Buffer.from('simplyrets:simplyrets').toString('base64');
    request.headers.set('Authorization', `Basic ${encodedCreds}`);
  }

  getAllProperties() {
    return this.get('/');
  }

  getPropertiesByCity(city) {
    return this.get(`?cities=${city}`);
  }
}

module.exports = SimplyRetsAPI;
