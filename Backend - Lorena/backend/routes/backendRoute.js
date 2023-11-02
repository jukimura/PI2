//const Router = require("express").Router;
const {Router} = require("express");
const router = Router();

//get post put delete
// get(path:"string")
// req, res = requisição, resposta
// () => {} arrow function
router.get("/servicos", (req, res) => { //localhost:3000/servicos
    res.send("chegou aqui, lista os serviços");
});

router.post("/servicos", (req,res) => {
    res.send("chegou aqui, novo serviço");
});

//qual eu quero alterar, id
router.put("/servico/:id", (req,res) => {
    const {id} = req.params;
    res.send('chegou aqui, atualizando serviço ${id}');
});

//pode fazer o id das duas formas
router.delete("/servico/:id", (req,res) => {
    const {id} = req.params;
    res.send("chegou aqui, deletando serviço" + id + "");
});

module.exports = router;