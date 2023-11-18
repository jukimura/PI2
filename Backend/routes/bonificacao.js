const express = require('express');
const oracledb = require('oracledb');
const router = express.Router();
require('dotenv').config();
const db = require('../database');
const env = process.env;

router.get('/getRecompensas/:idCartao', async (req, res, next) => {
    //puxar da tabela bonificação
    //SELECT Id_recompensa, r.Nome_recompensa FROM Bonificacao b RIGHT JOIN Recompensa r ON b.fk_id_recompensa = r.Id_recompensa
    //RIGHT JOIN Cartao c ON b.fk_id_cartao = c.Id_cartao WHERE c.Id_cartao = :idCartao;
});

router.get('/getRecompensasDisponiveis/:idCartao', async (req, res, next) => {
  //puxar da tabela bonificação
  //SELECT Id_recompensa, r.Nome_recompensa FROM Bonificacao b RIGHT JOIN Recompensa r ON b.fk_id_recompensa = r.Id_recompensa
  //RIGHT JOIN Cartao c ON b.fk_id_cartao = c.Id_cartao WHERE c.Id_cartao = :idCartao AND Status_recompensa = 'Disponível';
});

router.get('/getRecompensasUsadas/:idCartao', async (req, res, next) => {
  //puxar da tabela bonificação
  //SELECT r.Nome_recompensa FROM Bonificacao b RIGHT JOIN Recompensa r ON b.fk_id_recompensa = r.Id_recompensa
  //RIGHT JOIN Cartao c ON b.fk_id_cartao = c.Id_cartao WHERE c.Id_cartao = :idCartao AND Status_recompensa = 'Usado';
});

router.post('/registroRecompensa/:idCartao', async (req, res, next) => {
  //INSERT INTO Bonificacao (fk_id_cartao, fk_id_servico, Data_Aquisicao, Status_recompensa) VALUES(:1, :2, CURRENT_TIMESTAMP, :4)';
});

router.patch('/registroUsoRecompensa/:idCartao', async (req, res, next) => {
  //status = usado
  //'UPDATE Bonificacao SET Data_uso = CURRENT_TIMESTAMP, Status_compra =:status WHERE fk_id_cartao =:idCartao AND id_compra =:idCompra';
});



module.exports = router;