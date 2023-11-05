const express = require('express');
const router = express.Router();
require('dotenv').config();
const db = require('../database');
const env = process.env;

router.get('/getCompras', async (req, res, next) => {
    try {
        const connection = await db.createConnection(); //inicia a conexão com o banco de dados
        const result = await connection.execute('SELECT * FROM Compras');
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
        const result = await connection.execute('SELECT * FROM Compras WHERE Id_Cartao = :id', [id]);
        res.send(result.rows);
      } catch (error) {
        console.error('Erro ao executar a consulta:', error);
        res.status(500).send('Erro interno do servidor');
      }
});


router.post('/compraServico/:idCartao', async (req, res, next) => {
    const idCartao = req.params.idCartao; //declaração do que será usado para passar no body da requisição
    const idServico = req.body.idServico;

      try{
        const connection = await db.createConnection(); //iniciar conexão com o banco

        const result = 'INSERT INTO Compras (ID_Compra, ID_Cartao, ID_Servico, Data_Compra) VALUES(sequencia_compra.NEXTVAL, :2, :3, CURRENT_TIMESTAMP)';
        
        const dados = [idCartao, idServico];
    
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

router.get('/servicos', async (req, res, next) => {
    const id = req.params.idCartao; //declaração do que será usado para passar no body da requisição
    try {
        const connection = await db.createConnection(); // iniciar conexão com o banco
        const result = await connection.execute('SELECT * FROM servico');
        res.send(result.rows); //retorna as linhas resultantes do select
      } catch (error) {
        console.error('Erro ao executar a consulta:', error);
        res.status(500).send('Erro interno do servidor');
      }
});

module.exports = router;