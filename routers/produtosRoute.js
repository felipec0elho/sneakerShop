const Router = require("express").Router;
const router = Router();

router.get("/produtos", (req,res) =>{
    res.send("Lista de produtos:");
});
router.post("/produtos", (req,res) =>{
    res.send("Produto adicionado com sucesso!");
});
router.put("/produto/:id", (req,res) =>{
    const { id } = req.params
    res.send("Produto: " + $id + " atualizado com sucesso!");
});
router.delete("/produto/:id", (req,res) =>{
    const { id } = req.params
    res.send("Produto: " + $id + " removido com sucesso!");
});



// router.get('/', produtoController.listar);
// router.get('/:id', produtoController.buscarPorId);
// router.post('/', produtoController.salvar);
// router.put('/:id', produtoController.atualizar);
// router.delete('/:id', produtoController.excluir);

module.exports = router;