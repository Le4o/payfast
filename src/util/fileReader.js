const fs = require('fs');

fs.readFile('../../public/images/noodle.jpg', (err, buffer) => {
    console.log('arquivo lido');

    fs.writeFile('../../public/images/noodle2.jpg', buffer, (err) => {
        console.log('Arquivo escrito');
    })
})