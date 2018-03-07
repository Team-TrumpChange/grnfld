let axios = require('axios');

let FOendpoints = {
  0: '/back',
  1: '/yoda',
  2: '/you',
  3: '/ing',
  4: '/nugget',
  5: '/off',
  6: '/problem',
  7: '/dalton',
  8: '/shutup',
  9: '/thinking'
}

const foaas = (message, username, callback) => {
  let index = (message.length%10);
  let endpoint = FOendpoints[index];
  let url = `http://foaas.com${endpoint}/${username}/Everyone`
  console.log(url);
  //callback('that was mean');
  axios.get(url, { headers: { 'Accept': 'text/plain' } })
    .then(res => {
      console.log(res.data);
      callback(null, res.data);
    }) 
    .catch(error => {
      callback(error);
    });
}

module.exports = foaas;
