const express = require('express');
const router = express.Router();
const ContasPagar = require('../models/contasPagarModel');

router.get('/contasPagar', async (req, res) => {
  try {
    const contas = await ContasPagar.listar();
    res.json(contas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const conta = await ContasPagar.buscarPorId(id);
    
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
    const contaId = await ContasPagar.criar(req.body);
    res.status(201).json({ id: contaId, message: 'Conta criada com sucesso!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sucesso = await ContasPagar.atualizar(id, req.body);
    
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
    const sucesso = await ContasPagar.excluir(id);
    
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
    const contasVencidas = await ContasPagar.obterContasVencidas();
    res.json(contasVencidas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/pagar', async (req, res) => {
  try {
    const { id } = req.params;
    const sucesso = await ContasPagar.marcarComoPaga(id);
    
    if (!sucesso) {
      return res.status(404).json({ error: 'Conta não encontrada' });
    }
    
    res.json({ message: 'Conta marcada como paga!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/alertas/proximo-vencimento', async (req, res) => {
  try {
    const { dias } = req.query;
    const contas = await ContasPagar.obterContasVencProx(dias || 7);
    res.json(contas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;