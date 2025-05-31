const express = require('express');
const router = express.Router();
const ItensVenda = require('../models/itensVendaModel');

router.get('/venda/:vendaId', async (req, res) => {
  try {
    const { vendaId } = req.params;
    const itens = await ItensVenda.listarPorVenda(vendaId);
    res.json(itens);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await ItensVenda.buscarPorId(id);
    
    if (!item) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const itemId = await ItensVenda.criar(req.body);
    res.status(201).json({ 
      id: itemId, 
      message: 'Item de venda criado com sucesso!' 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sucesso = await ItensVenda.atualizar(id, req.body);
    
    if (!sucesso) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }
    
    res.json({ message: `Item ${id} atualizado com sucesso!` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sucesso = await ItensVenda.excluir(id);
    
    if (!sucesso) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }
    
    res.json({ message: `Item ${id} removido com sucesso!` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
