const { createLogger, format, transports } = require('winston');
const fs = require('fs');

if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs');
}

module.exports = new createLogger({
    format: format.combine(
        format.json(),
        format.timestamp()
    ),
    transports: [
        new transports.File({
            level: 'info',
            filename: 'logs/payfast.log',
            maxsize: 100000,
            maxFiles: 10,
            timestamp: true
        })
    ]
});