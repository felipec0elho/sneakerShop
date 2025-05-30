const express = require('express');
const router = express.Router();
const ContasReceber = require('../models/ContasReceber');

router.get('/contasReceber', async (req, res) => {
  try {
    const contas = await ContasReceber.listar();
    res.json(contas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const conta = await ContasReceber.buscarPorId(id);
    
    if (!conta) {
      return res.status(404).json({ error: 'Conta não encontrada' });
    }
    
    res.json(conta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const contaId = await ContasReceber.criar(req.body);
    res.status(201).json({ id: contaId, message: 'Conta criada com sucesso!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sucesso = await ContasReceber.atualizar(id, req.body);
    
    if (!sucesso) {
      return res.status(404).json({ error: 'Conta não encontrada' });
    }
    
    res.json({ message: 'Conta atualizada com sucesso!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sucesso = await ContasReceber.excluir(id);
    
    if (!sucesso) {
      return res.status(404).json({ error: 'Conta não encontrada' });
    }
    
    res.json({ message: 'Conta excluída com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/alertas/vencidas', async (req, res) => {
  try {
    const contasVencidas = await ContasReceber.obterContasVencidas();
    res.json(contasVencidas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/receber', async (req, res) => {
  try {
    const { id } = req.params;
    const sucesso = await ContasPagar.marcarComoRecebida(id);
    
    if (!sucesso) {
      return res.status(404).json({ error: 'Conta não encontrada' });
    }
    
    res.json({ message: 'Conta marcada como recebida!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/alertas/proximo-vencimento', async (req, res) => {
  try {
    const { dias } = req.query;
    const contas = await ContasReceber.obterContasVencProx(dias || 7);
    res.json(contas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;