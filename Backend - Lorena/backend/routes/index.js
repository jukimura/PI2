const routerServico = require("./backendRoute");
module.exports = (app) => {
    app.use(routerServico);
}