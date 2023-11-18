const express = require('express');
const router = express.Router();
require('dotenv').config();
const db = require('../database');
const env = process.env;

router.get('/servicos', async (req, res, next) => {
    const id = req.params.idCartao; //declaração do que será usado para passar no body da requisição
    try {
        const connection = await db.createConnection(); // iniciar conexão com o banco
        const result = await connection.execute('SELECT * FROM Servico');
        res.send(result.rows); //retorna as linhas resultantes do select
      } catch (error) {
        console.error('Erro ao executar a consulta:', error);
        res.status(500).send('Erro interno do servidor');
      }
});

router.get('/getServicoById/:idServico', async (req, res, next) => {
  const id = req.params.idServico; //declaração do que será usado para passar no body da requisição
  try {
      const connection = await db.createConnection(); // iniciar conexão com o banco
      const result = await connection.execute('SELECT Nome_Servico FROM Servico WHERE Id_servico = :id', [id]);
      res.send(result.rows); //retorna as linhas resultantes do select
    } catch (error) {
      console.error('Erro ao executar a consulta:', error);
      res.status(500).send('Erro interno do servidor');
    }
});

module.exports = router;