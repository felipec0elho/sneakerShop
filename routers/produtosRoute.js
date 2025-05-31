const express = require('express');
const router = express.Router();
const Produto = require('../models/produtoModel')

router.get("/", async (req,res) =>{
    try {
    const produtos = await Produto.listar();
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const produto = await Produto.buscarPorId(id);
    
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    res.json(produto);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});
router.get('/:nome', async (req, res) => {
  try {
    const { nome } = req.params;
    const produto = await Produto.buscarPorNome(nome);
    
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    res.json(produto);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});


router.post('/', async (req, res) => {
    try {
        await Produto.criarProduto(req.body);
        res.status(201).json({ message: 'Produto adicionado com sucesso!' });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});


router.put("/:id", async (req,res) =>{
    try {
    const { id } = req.params
    const sucesso = await Produto.atualizar(id, req.body);
    if (!sucesso) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }
    res.json({ message:`Produto: ${id} atualizado com sucesso!`});
    } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});
router.delete("/:id",async (req,res) =>{
    try {
    const { id } = req.params
    const sucesso = await Produto.excluir(id);
    if (!sucesso) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }
    res.json({ message:`Produto: ${id} removido com sucesso!`});
    } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

module.exports = router;