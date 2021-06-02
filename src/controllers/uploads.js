const fs = require('fs');

module.exports = app => {
    app.post('/upload/imagem', (req, res) => {
        console.log('Recebendo imagem');
        req.pipe(fs.createWriteStream(`public/images/${req.headers.filename}`))
            .on('finish', () =>{
                res.status(201).send("Arquivo salvo");
            })
        return;
    })
}