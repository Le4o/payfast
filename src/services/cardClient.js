const restify = require('restify-clients');

function cardClient() {

    let client = restify.createJsonClient({
        url: 'http://localhost:3001'
    });

    this._client = client;
}

cardClient.prototype.authorize = function(card, callback) {
        
    this._client.post('/cartoes/autoriza', card, (err, req, res, returnValue) => {
        console.log('Consumindo serviço de cartões');
        console.log(err);
        callback(err, req, res, returnValue);
    });
}

module.exports = function() {
    return cardClient;
};