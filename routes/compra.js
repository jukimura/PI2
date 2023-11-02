const express = require('express');
const router = express.Router();


//rota para o momento de adquirir servico
//passa o numero do cartão e da um post na tabela de compras
//insert into compras values(id cartao passado nos parametros, id servico recuperado do js);
router.post('/:idCartao', (req, res, next) => {
    res.status(200).send({
        mensagem: 'Entrou método certo'
    });
});


module.exports = router;