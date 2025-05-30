const express = require('express');
const router = express.Router();
const Venda = require('../models/Venda');

router.get('/vendas', async (req, res) => {
  try {
    const vendas = await Venda.listar();
    res.json(vendas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const venda = await Venda.buscarPorId(id);
    
    if (!venda) {
      return res.status(404).json({ error: 'Venda não encontrada' });
    }
    
    res.json(venda);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const vendaId = await Venda.criar(req.body);
    res.status(201).json({ id: vendaId, message: 'Venda criada com sucesso!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
  }catch(error) {
    res.status(400).json({ error: 'Status inválido' });
  }
  try {
    const venda = await Venda.atualizarStatus(id, status);
    res.json(venda);
    } catch (error) {
        res.status(500).json({ error: error.message });
}
});
module.exports = router;