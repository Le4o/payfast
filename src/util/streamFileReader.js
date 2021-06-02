const fs = require('fs');

fs.createReadStream('../../public/images/noodle.jpg')
    .pipe(fs.createWriteStream('../../public/images/noodle2.jpg'))
    .on('finish', () => {
        console.log('Arquivo escrito com stream');
    });