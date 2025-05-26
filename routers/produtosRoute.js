const Router = require("express").Router;
const router = Router();

router.get("/produtos", async (req,res) =>{
    try {
    const produtos = await produto.listar();
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const produto = await produto.buscarPorId(id);
    
    if (!produto) {
      return res.status(404).json({ error: 'produto não encontrado' });
    }
    
    res.json(produto);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});
router.get('/:nome', async (req, res) => {
  try {
    const { id } = req.params;
    const produto = await produto.buscarPorNome(id);
    
    if (!produto) {
      return res.status(404).json({ error: 'produto não encontrado' });
    }
    
    res.json(produto);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});


router.post('/', async (req, res) => {
    try {
        const produto_id = await produto.criar(req.body);
        res.status(201).json({ id: produtoId, message: 'Produto adicionado com sucesso!' });
        } catch (error) {
            res.status(500).json({ erro: error.message });
            }
});

router.put("/produto/:id", async (req,res) =>{
    try {
    const { id } = req.params
    const sucesso = await produto.atualizar(id, req.body);
    if (!sucesso) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }
    res.json({ message:`Produto: ${id} atualizado com sucesso!`});
    } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});
router.delete("/produto/:id",async (req,res) =>{
    try {
    const { id } = req.params
    const sucesso = await produto.excluir(id);
    if (!sucesso) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }
    res.json({ message:`Produto: ${id} removido com sucesso!`});
    } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

module.exports = router;