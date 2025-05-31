const express = require('express');
const router = express.Router();
const Fornecedor = require('../models/fornecedorModel');

router.get('/', async (req, res) => {
  try {
    const { stats } = req.query;
    let fornecedores;
    
    if (stats === 'true') {
      fornecedores = await Fornecedor.listarComEstatisticas();
    } else {
      fornecedores = await Fornecedor.listar();
    }
    
    res.json(fornecedores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const fornecedor = await Fornecedor.buscarPorId(id);
    
    if (!fornecedor) {
      return res.status(404).json({ error: 'Fornecedor não encontrado' });
    }
    
    res.json(fornecedor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post('/', async (req, res) => {
  try {
    const fornecedorId = await Fornecedor.criar(req.body);
    res.status(201).json({ 
      id: fornecedorId, 
      message: 'Fornecedor criado com sucesso!' 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sucesso = await Fornecedor.atualizar(id, req.body);
    
    if (!sucesso) {
      return res.status(404).json({ error: 'Fornecedor não encontrado' });
    }
    
    res.json({ message: `Fornecedor ${id} atualizado com sucesso!` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sucesso = await Fornecedor.excluir(id);
    
    if (!sucesso) {
      return res.status(404).json({ error: 'Fornecedor não encontrado' });
    }
    
    res.json({ message: `Fornecedor ${id} removido com sucesso!` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/cnpj/:cnpj', async (req, res) => {
  try {
    const { cnpj } = req.params;
    const fornecedor = await Fornecedor.buscarPorCnpj(cnpj);
    
    if (!fornecedor) {
      return res.status(404).json({ error: 'Fornecedor não encontrado' });
    }
    
    res.json(fornecedor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
    
