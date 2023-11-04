const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const rotaCartao = require('./routes/cartao');
const rotaCompras = require('./routes/compras');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', rotaCartao);
app.use('/', rotaCompras);


app.use((req, res, next) => {
    const erro = new Error('Não encontrado');
    erro.status(404);
    next(erro);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    });
});

module.exports = app;