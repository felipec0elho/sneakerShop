const express = require('express');
const router = express.Router();
const Carrinho = require('../models/carrinhoModel');

router.get('/', async (req, res) => {
  try {
    const { cliente_id, session_id } = req.query;
    const itens = await Carrinho.obterItens(cliente_id, session_id);
    res.json(itens);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/resumo', async (req, res) => {
  try {
    const { cliente_id, session_id } = req.query;
    const resumo = await Carrinho.obterResumo(cliente_id, session_id);
    res.json(resumo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/adicionar', async (req, res) => {
  try {
    const itemId = await Carrinho.adicionarItem(req.body);
    res.status(201).json({ id: itemId, message: 'Item adicionado ao carrinho!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantidade } = req.body;
    
    const sucesso = await Carrinho.atualizarQuantidade(id, quantidade);
    
    if (!sucesso) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }
    
    res.json({ message: 'Quantidade atualizada!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sucesso = await Carrinho.removerItem(id);
    
    if (!sucesso) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }
    
    res.json({ message: 'Item removido do carrinho!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/', async (req, res) => {
  try {
    const { cliente_id, session_id } = req.query;
    const removidos = await Carrinho.limparCarrinho(cliente_id, session_id);
    res.json({ message: `${removidos} itens removidos do carrinho!` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;