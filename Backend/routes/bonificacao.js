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
  const idCartao = req.params.idCartao; //declaração do que será usado para passar no body da requisição
  const idRecompensa = req.body.idRecompensa;
  const status = 'Disponível';

    try{
      const connection = await db.createConnection(); //iniciar conexão com o banco

      const query = 'INSERT INTO Bonificacao (fk_id_cartao, fk_id_recompensa, Data_aquisicao, Status_recompensa) VALUES (:1, :2, CURRENT_TIMESTAMP, :3)';
      
      const dados = [idCartao, idRecompensa, status];
  
      let resInsert = await connection.execute(query, dados);
      await connection.commit();   //commitar a conexão para que os dados nao sejam perdidos

      const rowsInserted = resInsert.rowsAffected; 

      if(rowsInserted !== undefined &&  rowsInserted === 1) {
        res.status(200).send('Recompensa.');
    }
    }catch (error) {
        console.error('Erro ao executar a consulta:', error);
        res.status(500).send('Erro interno do servidor');
      }
});

router.patch('/registrarUsoRecompensa/:idCartao', async (req, res, next) => {
  const idCartao = req.params.idCartao;
  const idBonificacao = req.body.idBonificacao;
  const status = 'Usado';

  try {
    const connection = await db.createConnection();

    const result = 'UPDATE Bonificacao SET Data_uso = CURRENT_TIMESTAMP, Status_recompensa = :status WHERE fk_id_cartao = :idCartao AND Id_bonificacao = :idBonificacao';
    const dados = [status, idCartao, idBonificacao];
    console.log('result ', result);
    console.log('dados ', dados);
    let resInsert = await connection.execute(result, dados);
    await connection.commit();

    if (resInsert.rowsAffected !== undefined && resInsert.rowsAffected === 1) {
      res.status(200).send('Uso registrado com sucesso.');
    } else {
      res.status(500).send('Falha ao registrar o uso da recompensa.');
    }
  } catch (error) {
    console.error('Erro ao executar a consulta:', error);
    res.status(500).send('Erro interno do servidor');
  }
});


module.exports = router;