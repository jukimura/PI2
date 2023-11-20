const express = require('express');
const router = express.Router();
require('dotenv').config();
const db = require('../database');
const env = process.env;

router.get('/getCompras', async (req, res, next) => {
    try {
        const connection = await db.createConnection(); //inicia a conexão com o banco de dados
        const result = await connection.execute('SELECT * FROM Compra');
        res.send(result.rows);
      } catch (error) {
        console.error('Erro ao executar a consulta:', error);
        res.status(500).send('Erro interno do servidor');
      }
});

router.get('/getComprasById/:idCartao', async (req, res, next) => {
    const id = req.params.idCartao;
    try {
        const connection = await db.createConnection(); //inicia a conexão com o banco de dados
        const result = await connection.execute('SELECT * FROM Compra WHERE fk_id_cartao = :id', [id]);
        res.send(result.rows);
      } catch (error) {
        console.error('Erro ao executar a consulta:', error);
        res.status(500).send('Erro interno do servidor');
      }
});

router.get('/getComprasNaoUsadasById/:idCartao', async (req, res, next) => {
  const id = req.params.idCartao;
  const status = 'Disponível';
  try {
      const connection = await db.createConnection(); //inicia a conexão com o banco de dados
      const result = await connection.execute('SELECT * FROM Compra WHERE fk_id_cartao = :id AND Status_compra =:status', [id, status]);
      res.send(result.rows);
    } catch (error) {
      console.error('Erro ao executar a consulta:', error);
      res.status(500).send('Erro interno do servidor');
    }
});

router.get('/getComprasUsadasById/:idCartao', async (req, res, next) => {
  const id = req.params.idCartao;
  const status = 'Usado';
  try {
      const connection = await db.createConnection(); //inicia a conexão com o banco de dados
      const result = await connection.execute('SELECT * FROM Compra WHERE fk_id_cartao = :id AND Status_compra =:status', [id, status]);
      res.send(result.rows);
    } catch (error) {
      console.error('Erro ao executar a consulta:', error);
      res.status(500).send('Erro interno do servidor');
    }
});

router.post('/compraServico/:idCartao', async (req, res, next) => {
    const idCartao = req.params.idCartao; //declaração do que será usado para passar no body da requisição
    const idServico = req.body.idServico;
    const status = 'Disponível';

      try{
        const connection = await db.createConnection(); //iniciar conexão com o banco

        const result = 'INSERT INTO Compra (fk_id_cartao, fk_id_servico, Data_Compra, Status_compra) VALUES(:1, :2, CURRENT_TIMESTAMP, :4)';
        
        const dados = [idCartao, idServico, status];
    
        let resInsert = await connection.execute(result, dados);
        await connection.commit();   //commitar a conexão para que os dados nao sejam perdidos

        const rowsInserted = resInsert.rowsAffected; 

        if(rowsInserted !== undefined &&  rowsInserted === 1) {
          res.status(200).send('Compra feita com sucesso.');
      }
      }catch (error) {
          console.error('Erro ao executar a consulta:', error);
          res.status(500).send('Erro interno do servidor');
        }
});

router.patch('/registrarUso/:idCartao', async (req, res, next) => {
  const idCartao = req.params.idCartao; //declaração do que será usado para passar no body da requisição
  const idCompra = req.body.idCompra;
  const status = 'Usado';

    try{
      const connection = await db.createConnection(); //iniciar conexão com o banco

      const result = 'UPDATE Compra SET Data_uso = CURRENT_TIMESTAMP, Status_compra =:1 WHERE fk_id_cartao =:2 AND id_compra =:3';
      const dados = [status, idCartao, idCompra];
  
      let resInsert = await connection.execute(result, dados);
      await connection.commit();   //commitar a conexão para que os dados nao sejam perdidos

      const rowsInserted = resInsert.rowsAffected; 

      if(rowsInserted !== undefined &&  rowsInserted === 1) {
        res.status(200).send('Uso registrado com sucesso.');
    }
    }catch (error) {
        console.error('Erro ao executar a consulta:', error);
        res.status(500).send('Erro interno do servidor');
      }
});


module.exports = router;