const express = require('express');
const oracledb = require('oracledb');
const router = express.Router();
require('dotenv').config();
const db = require('../database');
const env = process.env;

router.get('/getRecompensas/:idCartao', async (req, res, next) => {
    const idCartao = req.params.idCartao; 
    try {
        const connection = await db.createConnection(); // iniciar conexão com o banco
        const result = await connection.execute('SELECT * FROM Bonificacao b INNER JOIN Recompensa r ' + 
                                                  'ON b.fk_id_recompensa = r.Id_recompensa INNER JOIN Cartao c ON b.fk_id_cartao = c.Id_cartao ' +
                                                  'WHERE c.Id_cartao = :idCartao', [idCartao]);
        res.send(result.rows); //retorna as linhas resultantes do select
      } catch (error) {
        console.error('Erro ao executar a consulta:', error);
        res.status(500).send('Erro interno do servidor');
      }  
  });

router.get('/getRecompensasDisponiveis/:idCartao', async (req, res, next) => {
  const idCartao = req.params.idCartao; 
  const status = 'Disponível';
  try {
      const connection = await db.createConnection(); // iniciar conexão com o banco
      const result = await connection.execute('SELECT * FROM Bonificacao b INNER JOIN Recompensa r ' + 
                                                'ON b.fk_id_recompensa = r.Id_recompensa INNER JOIN Cartao c ON b.fk_id_cartao = c.Id_cartao ' +
                                                'WHERE c.Id_cartao = :idCartao AND Status_recompensa =:status', [idCartao, status]);
      res.send(result.rows); //retorna as linhas resultantes do select
    } catch (error) {
      console.error('Erro ao executar a consulta:', error);
      res.status(500).send('Erro interno do servidor');
    }  
});

router.get('/getRecompensasUsadas/:idCartao', async (req, res, next) => {
  const idCartao = req.params.idCartao; 
  const status = 'Usado';
  try {
      const connection = await db.createConnection(); // iniciar conexão com o banco
      const result = await connection.execute('SELECT * FROM Bonificacao b INNER JOIN Recompensa r ' + 
                                                'ON b.fk_id_recompensa = r.Id_recompensa INNER JOIN Cartao c ON b.fk_id_cartao = c.Id_cartao ' +
                                                'WHERE c.Id_cartao = :idCartao AND Status_recompensa =:status', [idCartao, status]);
      res.send(result.rows); //retorna as linhas resultantes do select
    } catch (error) {
      console.error('Erro ao executar a consulta:', error);
      res.status(500).send('Erro interno do servidor');
    }  
});

router.post('/registroRecompensa/:idCartao', async (req, res, next) => {
  //status disponível
  //data de hoje
  //buscar id da recompensa do body
  //INSERT INTO Bonificacao (fk_id_cartao, fk_id_servico, Data_Aquisicao, Status_recompensa) VALUES(:1, :2, CURRENT_TIMESTAMP, :4)';
});

router.patch('/registroUsoRecompensa/:idCartao', async (req, res, next) => {
  //status = usado
  //'UPDATE Bonificacao SET Data_uso = CURRENT_TIMESTAMP, Status_compra =:status WHERE fk_id_cartao =:idCartao AND id_compra =:idCompra';
});



module.exports = router;