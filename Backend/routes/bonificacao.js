const express = require('express');
const oracledb = require('oracledb');
const router = express.Router();
require('dotenv').config();
const db = require('../database');
const env = process.env;

router.get('/getRecompensas', async (req, res, next) => {
   //puxar da tabela recompensa
  });

router.get('/getRecompensa/:idCartao', async (req, res, next) => {
    //puxar da tabela aquisicao
});



module.exports = router;