module.exports = app => {
    app.post('/correios/calcula-prazo', (req, res) => {
        const deliveryData = req.body;

        let postofficeSOAPClient = new app.services.postofficeSOAPClient();
        postofficeSOAPClient.loadPrice(deliveryData, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }

            console.log('Prazo calculado');
            return res.json(result);
        })
    })
}