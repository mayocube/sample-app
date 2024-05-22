import { random } from 'lodash';
import { useOktaAuth }  from '@okta/okta-react';
import axios from 'axios';

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

    if (config.serverlessDomain) {
      this.serverlessDomain = config.serverlessDomain;
    } else {
      console.error('serverlessDomain is not set in config file');
    }
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

  // fetchJsonWithReject = async (url, config, attempts = 0) => {
  //   console.log("https://" + this.serverlessDomain + "/" + url, config)

  //   const fetchConfig = {
  //     ...config,
  //     headers: {
  //       ...config.headers
  //     }
  //   };

  //   return fetch("https://" + this.serverlessDomain + "/" + url, fetchConfig)
  //     .then(async (response) => {
  //       if (!response.ok) {
  //         throw response;
  //       }
  //       return response.json();
  //     })
  //     .catch(async (error) => {
  //       // Try to return proper error message from both caught promises and Error objects
  //       // https://gist.github.com/odewahn/5a5eeb23279eed6a80d7798fdb47fe91
  //       try {
  //         // Generic retry when calls return a 'too many requests' response
  //         // request is delayed by a random number which grows with the number of retries
  //         if (error.status === 429 && attempts < 10) {
  //           await delay(random(100, 750) + attempts * 100);
  //           return await this.fetchJsonWithReject(url, config, attempts + 1);
  //         }
  //         return error.json().then((response) => {
  //           throw response;
  //         });
  //       } catch (e) {
  //         throw error;
  //       }
  //     });
  // };

  fetchJsonWithReject = async (url, config, attempts = 0) => {
    console.log("https://" + this.serverlessDomain + "/" + url, config);
    // let storage = localStorage.getItem("okta-token-storage");
    // let token=null;
    // if (storage){
    //   token = JSON.parse(storage)?.accessToken?.accessToken;
    // }
    // console.log("fetchJsonWithReject access token=", token);
    let storage = localStorage.getItem("okta-token-storage");
    let token=(storage)?JSON.parse(storage)?.accessToken?.accessToken:null;

    const fetchConfig = {
      ...config,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer "+token
      }
    };

    return fetch("https://" + this.serverlessDomain + "/" + url, fetchConfig)
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

  post = async (url, payload) => {
    try {
      let storage = localStorage.getItem("okta-token-storage");
      let token=(storage)?JSON.parse(storage)?.accessToken?.accessToken:null;
    
      // console.log("post access token=", token);
      const axiosConfig = {
          headers: {
            accept: 'application/json',
            Authorization: token,
            'Content-Type': 'application/json'
          }
        };
      const response = await axios.post("https://" + this.serverlessDomain + "/" + url, payload, axiosConfig);
      return response.data;
    } catch (error) {
      // Handle error
      console.error('Error:', error.message);
      throw error;
    }
  };
}
