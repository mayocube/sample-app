import { random } from 'lodash';

import config from '../config';

async function delay(ms, result) {
  return new Promise(resolve => setTimeout(() => resolve(result), ms));
}

export default class ApiService {
  serverlessDomain;

  serverlessProtocol;

  constructor() {
    this.serverlessProtocol = 'https';
    this.serverlessDomain = '';

    if (config.serverlessDomain) this.serverlessDomain = config.serverlessDomain;

    if (!this.serverlessDomain) console.error('serverlessDomain is not set in config file');
  }

  buildBody = (encodedParams) => {
    return Object.keys(encodedParams).reduce((result, paramName, idx) => {
      if (encodedParams[paramName] === undefined) {
        return result;
      }
      if (idx > 0) {
        return `${result}&${paramName}=${encodedParams[paramName]}`;
      }
      return `${paramName}=${encodedParams[paramName]}`;
    }, '');
  };

  fetchJsonWithReject = async (url, config, attempts = 0) => {
    return fetch(url, config)
      .then(async (response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .catch(async (error) => {
        // Try to return proper error message from both caught promises and Error objects
        // https://gist.github.com/odewahn/5a5eeb23279eed6a80d7798fdb47fe91
        try {
          // Generic retry when calls return a 'too many requests' response
          // request is delayed by a random number which grows with the number of retries
          if (error.status === 429 && attempts < 10) {
            await delay(random(100, 750) + attempts * 100);
            return await this.fetchJsonWithReject(url, config, attempts + 1);
          }
          return error.json().then((response) => {
            throw response;
          });
        } catch (e) {
          throw error;
        }
      });
  };
}
