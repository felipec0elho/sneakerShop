const express = require('express');
const router = express.Router();
const Cliente = require('../models/clienteModel.js')

router.get("/", async (req,res) =>{
    try {
    const clientes = await Cliente.listar();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.buscarPorId(id);
    
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});
router.get('/:nome', async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.buscarPorNome(id);
    
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});


router.post('/', async (req, res) => {
    try {
        const clienteId = await Cliente.criarCliente(req.body);
        res.status(201).json({ id: clienteId, message: 'Cliente adicionado com sucesso!' });
        } catch (error) {
            res.status(500).json({ erro: error.message });
            }
});

router.put("/cliente/:id", async (req,res) =>{
    try {
    const { id } = req.params
    const sucesso = await Cliente.atualizar(id, req.body);
    if (!sucesso) {
      return res.status(404).json({ erro: 'Cliente não encontrado' });
    }
    res.json({ message:`Cliente: ${id} atualizado com sucesso!`});
    } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});
router.delete("/cliente/:id",async (req,res) =>{
    try {
    const { id } = req.params
    const sucesso = await Cliente.excluir(id);
    if (!sucesso) {
      return res.status(404).json({ erro: 'Cliente não encontrado' });
    }
    res.json({ message:`Cliente: ${id} removido com sucesso!`});
    } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

module.exports = router;