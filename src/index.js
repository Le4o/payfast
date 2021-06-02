const app = require('./config/custom-express')

app.listen(3000, () => {
    console.log("Servidor iniciado na porta 3000");
})