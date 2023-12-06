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

//rotas de relatório do terminal do usuário
router.get('/getInfosRelatorio1/:idCartao', async (req, res, next) => {
  const id = req.params.idCartao;
  try {
      const connection = await db.createConnection(); //inicia a conexão com o banco de dados
      const result = await connection.execute('SELECT s.Nome_servico, c.Data_compra, c.Data_uso,c.Status_compra '+
                                              'FROM Servico s INNER JOIN Compra c ON s.Id_servico = c.fk_id_servico '+
                                              'WHERE c.fk_id_cartao =:id', [id]);
      res.send(result.rows);
    } catch (error) {
      console.error('Erro ao executar a consulta:', error);
      res.status(500).send('Erro interno do servidor');
    }
});


router.get('/getInfosRelatorio2/:idCartao', async (req, res, next) => {
  const id = req.params.idCartao;
  try {
      const connection = await db.createConnection(); //inicia a conexão com o banco de dados
      const result = await connection.execute('SELECT r.Nome_recompensa, b.Data_aquisicao, b.Data_uso, b.Status_recompensa '+
                                              'FROM Recompensa r INNER JOIN Bonificacao b ON r.Id_recompensa = b.fk_id_recompensa '+
                                              'WHERE b.fk_id_cartao =:id', [id]);
      res.send(result.rows);
    } catch (error) {
      console.error('Erro ao executar a consulta:', error);
      res.status(500).send('Erro interno do servidor');
    }
});

//rotas relatorio de venda
router.get('/relatorioVendasServicos', async (req, res, next) => {
  try {
      const connection = await db.createConnection();
      
      const result = await connection.execute(`SELECT s.Nome_servico, COUNT(c.Id_compra) AS qtdVendas, 
        (SELECT COUNT(*) FROM COMPRA WHERE fk_id_servico NOT IN (10, 11, 12)) AS TotalServicosUsados FROM Servico s LEFT JOIN Compra c 
        ON s.Id_servico = c.fk_id_servico WHERE c.fk_id_servico NOT IN (10, 11, 12) GROUP BY s.Nome_servico`);
      res.send(result.rows);
  } catch (error) {
      console.error('Erro ao executar a consulta:', error);
      res.status(500).send('Erro interno do servidor');
  }
});

router.get('/relatorioVendasKits', async (req, res, next) => {
  try {
      const connection = await db.createConnection();
      
      const result = await connection.execute(`SELECT s.Nome_servico, COUNT(c.Id_compra) AS qtdVendas, 
        (SELECT COUNT(*) FROM COMPRA WHERE fk_id_servico IN (10, 11, 12)) AS TotalServicosUsados FROM Servico s LEFT JOIN Compra c 
        ON s.Id_servico = c.fk_id_servico WHERE c.fk_id_servico IN (10, 11, 12) GROUP BY s.Nome_servico`);
      res.send(result.rows);
  } catch (error) {
      console.error('Erro ao executar a consulta:', error);
      res.status(500).send('Erro interno do servidor');
  }
});

//rota relatorio de utilizacao de servicos
router.get('/relatorioUsos', async (req, res, next) => {
  const status = 'Usado';
  try {
      const connection = await db.createConnection();
      
      const result = await connection.execute(`SELECT s.Nome_servico, COUNT(c.Id_compra) AS qtdUsos, 
      (SELECT COUNT(*) FROM COMPRA WHERE Status_compra='Usado') AS TotalServicosUsados FROM Servico s 
      LEFT JOIN Compra c ON s.Id_servico = c.fk_id_servico WHERE c.STATUS_COMPRA = 'Usado' 
      GROUP BY s.Nome_servico`);

       res.send(result.rows);
    } catch (error) {
          console.error('Erro ao executar a consulta:', error);
          res.status(500).send('Erro interno do servidor');
    }
});

router.get('/relatorioUsosRecompensas', async (req, res, next) => {
  try {
      const connection = await db.createConnection();
      
      const result = await connection.execute(`SELECT r.nome_recompensa, COUNT(b.Id_bonificacao) AS qtdUsos, 
      (SELECT COUNT(*) FROM BONIFICACAO WHERE STATUS_RECOMPENSA='Usado') AS TotalRecompensasUsadas FROM Recompensa r 
      LEFT JOIN BONIFICACAO b ON r.ID_RECOMPENSA = b.FK_ID_RECOMPENSA WHERE b.STATUS_RECOMPENSA = 'Usado' 
      GROUP BY r.NOME_RECOMPENSA `);

       res.send(result.rows);
    } catch (error) {
          console.error('Erro ao executar a consulta:', error);
          res.status(500).send('Erro interno do servidor');
    }
});

router.get('/relatorioRecompensasNaoUsadas', async (req, res, next) => {
  try {
      const connection = await db.createConnection();
      
      const result = await connection.execute(`SELECT r.nome_recompensa, COUNT(b.Id_bonificacao) AS qtdUsos, 
      (SELECT COUNT(*) FROM BONIFICACAO WHERE STATUS_RECOMPENSA='Disponível') AS TotalRecompensasUsadas FROM Recompensa r 
      LEFT JOIN BONIFICACAO b ON r.ID_RECOMPENSA = b.FK_ID_RECOMPENSA WHERE b.STATUS_RECOMPENSA = 'Disponível' 
      GROUP BY r.NOME_RECOMPENSA `);

       res.send(result.rows);
    } catch (error) {
          console.error('Erro ao executar a consulta:', error);
          res.status(500).send('Erro interno do servidor');
    }
});

//rota relatorio recompensa
router.get('/relatorioRecompensas', async (req, res, next) => {
  const idCartao = req.params.idCartao;
  try {
      const connection = await db.createConnection();
      
      const result = await connection.execute(`SELECT r.Nome_recompensa, COUNT(b.Id_bonificacao) AS Quantidade,
          (SELECT COUNT(*) FROM Bonificacao) AS TotalGeradas FROM Bonificacao b INNER JOIN Recompensa r 
          ON r.ID_RECOMPENSA = b.FK_ID_RECOMPENSA GROUP BY r.Nome_recompensa`);
      res.send(result.rows);
  } catch (error) {
      console.error('Erro ao executar a consulta:', error);
      res.status(500).send('Erro interno do servidor');
  }
});

//rota relatorio serviços e kits não utilizados
router.get('/relatorioServicosNaoUtilizados', async (req, res, next) => {
  try {
      const connection = await db.createConnection();
      
      const result = await connection.execute(`
          SELECT s.NOME_SERVICO, COUNT(c.Id_compra) AS QuantidadeNaoUsados,
          (SELECT COUNT(*) FROM COMPRA WHERE Status_compra= 'Disponível') AS TotalIndividuaisNaoUsados
          FROM Compra c
          INNER JOIN Servico s ON s.ID_SERVICO = c.FK_ID_SERVICO
          WHERE c.STATUS_COMPRA = 'Disponível'
          GROUP BY s.NOME_SERVICO
      `);

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