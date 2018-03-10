let axios = require('axios');
const db = require('../database-pg/index');

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

const foaas = async (message, user_id, callback) => {

  let endpoint = FOendpoints[message.length % 10];
  
  let username = await db.getUsername(user_id);

  let url = `http://foaas.com${endpoint}/${username}/Everyone`
  axios.get(url, { headers: { 'Accept': 'text/plain' } })
    .then(res => {
      callback(null, res.data);
    }) 
    .catch(error => {
      callback(error);
    });
}

module.exports = foaas;
