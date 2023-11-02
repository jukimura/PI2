const express = require('express');
const router = express.Router();

//rota para gerar o cartão
//insert into cartao values(id cartão recebido pela funcao de gerar numeros do js);
router.post('/gerarCartao/:idCartao', (req, res, next) => {
    const id = req.params.idCartao;
    res.status(200).send({
        mensagem: 'entrou post cartao'
    });
});

router.get('/:idCartao', (req, res, next) => {
    const id = req.params.idCartao;
    res.status(200).send({
        mensagem: 'Entrou get cartao'
    });
})
module.exports = router;