const express = require('express');
const router = express.Router();
const MovimentacaoEstoque = require('../models/movEstoqueModel');

router.get('/', async (req, res) => {
  try {
    const filtros = {
      produtoId: req.query.produtoId,
      tipo: req.query.tipo,
      dataInicio: req.query.dataInicio,
      dataFim: req.query.dataFim,
      funcionarioId: req.query.funcionarioId,
      limit: req.query.limit
    };
    
    const movimentacoes = await MovimentacaoEstoque.listar(filtros);
    res.json(movimentacoes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const movimentacao = await MovimentacaoEstoque.buscarPorId(id);
    
    if (!movimentacao) {
      return res.status(404).json({ error: 'Movimentação não encontrada' });
    }
    
    res.json(movimentacao);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const movimentacaoId = await MovimentacaoEstoque.criar(req.body);
    res.status(201).json({ 
      id: movimentacaoId, 
      message: 'Movimentação de estoque registrada com sucesso!' 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.get('/produto/:produtoId', async (req, res) => {
  try {
    const { produtoId } = req.params;
    const { limite } = req.query;
    
    const movimentacoes = await MovimentacaoEstoque.obterMovimentacoesPorProduto(
      produtoId, 
      limite || 50
    );
    res.json(movimentacoes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
