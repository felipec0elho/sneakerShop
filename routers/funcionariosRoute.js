const express = require('express');
const router = express.Router();
const Funcionario = require('../models/funcionarioModel.js');

router.get('/funcionarios', async (req,res) =>{
    try {
        const funcionarios = await Funcionario.listar();
        res.json(funcionarios);
        } catch (error) {
            res.status(500).json({message: error.message});
        }
});
router.get('/:id', async (req,res)=>{
    try {
        const{ id }= req.params;
        const funcionario = await Funcionario.buscarPorId(id);
        if(!funcionario){
            return res.status(404).json({message: 'Funcionario não encontrado'});
        }
        res.json(funcionario);
        } catch (error) {
            res.status(500).json({message: error.message});
            }
});
router.post('/', async (req, res) => {
  try {
    const funcionarioId = await Funcionario.criar(req.body);
    res.status(201).json({ id: funcionarioId, message: 'Funcionário criado com sucesso!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sucesso = await Funcionario.atualizar(id, req.body);
    
    if (!sucesso) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }
    
    res.json({ message: 'Funcionário atualizado com sucesso!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.delete('/:id', async (req,res) =>{
    try {
        const { id } = req.params;
        const sucesso = await Funcionario.excluir(id);
        if (!sucesso) {
            return res.status(404).json({ error: 'Funcionário não encontrado' });
            }
            res.json({ message: 'Funcionário excluído com sucesso!' });
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
});
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const funcionario = await Funcionario.validarSenha(email, senha);
    
    if (!funcionario) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }
    
    res.json({ funcionario, message: 'Login realizado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

  router.get('/:id/relatorio-vendas', async (req, res) => {
  try {
    const { id } = req.params;
    const { data_inicio, data_fim } = req.query;
    
    const relatorio = await Funcionario.obterRelatorioVendas(id, data_inicio, data_fim);
    res.json(relatorio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
  
module.exports = router;