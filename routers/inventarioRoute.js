const express = require('express');
const router = express.Router();
const Inventario = require('../models/Inventario');

router.get("/inventarios", async (req,res) =>{
    try {
    const inventarios = await Inventario.listar();
    res.json(inventarios);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});
router.get("/:id", async (req,res) =>{
    try {
        const id = req.params.id;
        const itemInvent = await Inventario.listarId(id);
        if (!itemInvent) {
        return res.status(404).json({ error: 'Item não encontrado' });
    }
        res.json(inventario);
    }catch (error) {
    res.status(500).json({ error: error.message });
    }
}
)
router.post('/movimentar', async (req, res) => {
  try {
    const { produto_id, quantidade, tipo, motivo, funcionarioId } = req.body;
    
    await Inventario.atualizarQuantidade(produto_id, quantidade, tipo, motivo, funcionarioId);
    res.json({ message: 'Movimentação realizada com sucesso!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.get('/movimentacoes/:produto_id?', async (req, res) => {
  try {
    const { produto_id } = req.params;
    const movimentacoes = await Inventario.obterMovimentacoes(produto_id);
    res.json(movimentacoes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/alertas/baixo-estoque', async (req, res) => {
  try {
    const produtos = await Inventario.obterProdutosBaixoEstoque();
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;