const { body, validationResult } = require('express-validator');
const logger = require('../services/logger.js');

module.exports = app => {
    app.get('/pagamentos', (req, res) => {
         res.send("OK");
    });

    app.get('/pagamentos/:id', (req, res) => {
        const id = req.params.id;
        console.log(`COnsultando pagamento ${id}`);

        let memcachedClient = new app.services.memcachedClient();

        memcachedClient.get(`payment-${id}`, (err, returnValue) => {
            if (err || !returnValue) {
                console.log('MISS - Chave não encontrada');
                
                let connection = app.dao.connectionFactory();
                let paymentDao = new app.dao.paymentDAO(connection);

                paymentDao.searchById(id, (err, result) => {
                    if (err) {
                        console.log('Erro ao consultar banco');
                        return res.status(404).send(err);
                    }

                    return res.json(result);
                })

            } else {
                console.log(`HIT: ${JSON.stringify(returnValue)}`)
                return res.json(returnValue);
            }
        });
    })

    app.post('/pagamentos',
        body('pagamento.forma_de_pagamento', 'Forma de pagamento é obrigatorio').notEmpty(),
        body('pagamento.valor', 'Valor é obrigatorio e deve ser um decimal').notEmpty().isFloat(),
        (req, res) => {

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                console.log('Erros de validação encontrados');
                return res.status(403).json({ errors: errors.array() });
            }

            let payment = req.body['pagamento'];

            payment.status = 'CRIADO';
            payment.date = new Date;

            let connection = app.dao.connectionFactory();
            let paymentDao = new app.dao.paymentDAO(connection);

            paymentDao.create(payment, (err, result) => {
                if (err) {
                    console.log(`Erro ao inserir no banco: ${err}`);
                    return res.status(500).send(err);
                } 
                
                payment.id = result.insertId;

                console.log('Pagamento criado');

                let memcachedClient = new app.services.memcachedClient();

                memcachedClient.set(`payment-${payment.id}`, payment, 60000, 
                    (err) => {
                        console.log(`Nova chave adicionado ao cache: ${payment.id}`);
                    }
                );
                
                if (payment.forma_de_pagamento === 'cartao') {
                    let card = req.body['cartao'];

                    let cardClient = new app.services.cardClient();
                    cardClient.authorize(card, (exception, request, response, returnValue) => {
                        if (exception) {
                            res.status(401).json(exception);
                        } else { 
                            res.status(202).json({returnValue, payment});
                        }
                    });
                    
                    return;
                }

                res.location(`/pagamentos/${payment.id}`);

                let response = {
                    ...payment,
                    links: [
                        {
                            href: `http://localhost:3000/pagamentos/${payment.id}`,
                            rel: 'confirmar',
                            method: 'PUT'
                        },
                        {
                            href: `http://localhost:3000/pagamentos/${payment.id}`,
                            rel: 'cancelar',
                            method: 'DELETE'
                        }
                    ]
                };

                return res.status(201).json(response);
            });
        });

    app.put('/pagamentos/:id', (req, res) => {
        const id = req.params.id;
        const payment = {
            id: id,
            status: 'CONFIRMADO'
        };

        let connection = app.dao.connectionFactory();
        let paymentDao = new app.dao.paymentDAO(connection);
        
        paymentDao.update(payment, (err, result) => {
            if (err) {
                console.log(`Erro ao inserir no banco: ${err}`);
                return res.status(500).send(err);
            }

            if (result.affectedRows < 1) {
                return res.status(200).json({ message: "Pagamento não encontrado" });
            }

            return res.status(202).send(payment);
        });
    });

    app.delete('/pagamentos/:id', (req, res) => {
        const id = req.params.id;
        const payment = {
            id: id,
            status: 'CANCELADO'
        };

        let connection = app.dao.connectionFactory();
        let paymentDao = new app.dao.paymentDAO(connection);
        
        paymentDao.update(payment, (err, result) => {
            if (err) {
                console.log(`Erro ao inserir no banco: ${err}`);
                return res.status(500).send(err);
            }

            if (result.affectedRows < 1) {
                return res.status(200).json({ message: "Pagamento não encontrado" });
            }

            return res.status(202).send(payment);
        });
    })
}