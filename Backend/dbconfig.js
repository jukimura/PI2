module.exports = {
    // crie uma variável de ambiente no Windows chamada
    // NODE_ORACLEDB_USER e faça ela valer o seu login,
    // por exemplo, SYSTEM
    user: 'bd290823267',
  
    // crie uma variável de ambiente no Windows chamada
    // NODE_ORACLEDB_PASSWORD e faça ela valer sua senha
    password:'Otaxt10',
  
    // crie uma variável de ambiente no Windows chamada
    // NODE_ORACLEDB_CONNECTIONSTRING e faça ela valer
    // o nome da máquina que executa o SGBD Oracle (por
    // exemplo LOCALHOST), seguido pelo nome da instância
    // de BD ao qual deseja se conectar (por exemplo, XE),
    // separando essas duas informações por uma /
    connectString: '172.16.12.14/xe',
  
    // a criação de uma variável de ambiente no Windows
    // chamada NODE_ORACLEDB_EXTERNALAUTH é opcional e seu
    // valor padrão é false; para maiores informações, veja
    // https://oracle.github.io/node-oracledb/doc/api.html#extauth
    externalAuth: process.env.NODE_ORACLEDB_EXTERNALAUTH ? true : false
  };
  