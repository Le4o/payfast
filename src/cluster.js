const cluster = require('cluster');
const os = require('os');

let cpus = os.cpus();

if (cluster.isMaster) {
    console.log('Eu sou o mestre');
    cpus.forEach(() => {
        cluster.fork();
    });

    cluster.on('listening', (worker) => {
        console.log(`Cluster conectado: ${worker.process.pid}`);
    });

    cluster.on('exit', (worker) => {
        console.log(`cluster ${worker.process.pid} desconectado`);
        cluster.fork();
    });
} else {
    require('./index.js');
}