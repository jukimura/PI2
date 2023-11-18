const express = require('express');
const oracledb = require('oracledb');
const router = express.Router();
require('dotenv').config();
const db = require('../database');
const env = process.env;

router.get('/getCartoes', async (req, res, next) => {
    try {
      const connection = await db.createConnection(); // inicia conexão com o banco
      let result = await connection.execute('SELECT * FROM Cartao'); //query para executar a busca
      res.send(result.rows); // retorno da query
    } catch (error) {
      console.error('Erro ao executar a consulta:', error);
      res.status(500).send('Erro interno do servidor');
    }
  });

router.get('/getCartao/:idCartao', async (req, res, next) => {
    const id = req.params.idCartao;
    try {
        const connection = await db.createConnection(); // inicia conexão com o banco
        let result = await connection.execute('SELECT * FROM Cartao WHERE Id_cartao = :id', [id]);
        res.send(result.rows);
      } catch (error) {
        console.error('Erro ao executar a consulta:', error);
        res.status(500).send('Erro interno do servidor');
      }
});


router.post('/cadastrarCartao', async(req, res, next) => { //inserir cartão
    const idCartao =  req.body.idCartao;

    try{
      const connection = await db.createConnection(); // inicia conexão com o banco
  
      const result = `INSERT INTO Cartao(Id_cartao) VALUES (:1)` 

      const dados = [idCartao];
  
      let resInsert = await connection.execute(result, dados);
      await connection.commit();  // Commit após a inserção

      const rowsInserted = resInsert.rowsAffected
      console.log(rowsInserted)
      if(rowsInserted !== undefined &&  rowsInserted === 1) {
        res.status(200).send('Cartão inserido com sucesso.');
    }
    }catch (error) {
        console.error('Erro ao executar a consulta:', error);
        res.status(500).send('Erro interno do servidor');
      }
});

module.exports = router;