const express = require('express');
const app = express();
const cors    = require('cors');

const bodyParser = require('body-parser');

const rotaCartao = require('./routes/cartao');
const rotaCompras = require('./routes/compras');
const rotaServico = require('./routes/servico');
const rotaRecompensa = require('./routes/recompensa');


function middleWareGlobal (req, res, next)
{
    console.time('Requisição'); // marca o início da requisição
    console.log('Método: '+req.method+'; URL: '+req.url); // retorna qual o método e url foi chamada

    next(); // função que chama as próximas ações

    console.log('Finalizou'); // será chamado após a requisição ser concluída

    console.timeEnd('Requisição'); // marca o fim da requisição
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());   // faz com que o express consiga processar JSON
app.use(cors()) //habilitando cors na nossa aplicacao (adicionar essa lib como um middleware da nossa API - todas as requisições passarão antes por essa biblioteca).
app.use(middleWareGlobal); // app.use cria o middleware global



app.use('/', rotaCartao);
app.use('/', rotaCompras);
app.use('/', rotaServico);
app.use('/', rotaRecompensa);

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