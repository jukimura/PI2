const express = require('express');
const oracledb = require('oracledb');
const router = express.Router();
require('dotenv').config();
const db = require('../database');
const env = process.env;

router.get('/getRecompensas', async (req, res, next) => {
  try {
      const connection = await db.createConnection(); // iniciar conexão com o banco
      const result = await connection.execute('SELECT * FROM Recompensa');
      res.send(result.rows); //retorna as linhas resultantes do select
    } catch (error) {
      console.error('Erro ao executar a consulta:', error);
      res.status(500).send('Erro interno do servidor');
    }  });

router.get('/getRecompensa/:idCartao', async (req, res, next) => {
    //puxar da tabela aquisicao
});



module.exports = router;