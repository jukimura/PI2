const http = require('http');
const app = require('./app');
const port = process.env.PORT || 3000;
const server = http.createServer(app);
console.log ('Servidor ativo na porta 3000...');
server.listen(port);
