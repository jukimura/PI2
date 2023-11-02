const express = require('express');
const app = express();

const rotaCartao = require('./routes/cartao');
const rotaAdquirirServico = require('./routes/compra');

app.use('/cartao', rotaCartao);
app.use('/compra', rotaAdquirirServico);

module.exports = app;