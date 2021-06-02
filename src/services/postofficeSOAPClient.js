const soap = require('soap');

function postofficeSOAPClient() {
    this._url = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl';
}

postofficeSOAPClient.prototype.loadPrice = function(deliveryData, callback) {
    soap.createClient(this._url,
        (err, client) => {
            console.log('Cliente SOAP criado');
            client.CalcPrazo(deliveryData, callback);
        }
    );
}

module.exports = function() {
    return postofficeSOAPClient
}