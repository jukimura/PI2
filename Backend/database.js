const oracledb = require('oracledb');
const dbConfig = require('./dbconfig.js');

async function createConnection() {
  if (global.conexao) {
    return global.conexao;
  }

  try {
    global.conexao = await oracledb.getConnection(dbConfig);
  } catch (erro) {
    console.log('Não foi possível estabelecer conexão com o BD!');
    process.exit(1);
  }

  return global.conexao;
}

module.exports = {
  createConnection,
};
