const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
const server = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));




const produtosRoute = require('./routers/produtosRoute');
const inventarioRoute = require('./routers/inventarioRoute');
const vendasRoute = require('./routers/vendasRoute');
const carrinhoRoute = require('./routers/carrinhoRoute');
const funcionariosRoute = require('./routers/funcionariosRoute');
const contasPagarRoute = require('./routers/contasPagarRoute');
const contasReceberRoute = require('./routers/contasReceberRoute');
const relatoriosRoute = require('./routers/relatoriosRoute');
const clientesRoute = require('./routers/clientesRoute');

app.use ('/produtos', produtosRoute);
app.use('/vendas', vendasRoute);
app.use('/inventario', inventarioRoute);
app.use('/carrinho', carrinhoRoute);
app.use('/funcionarios', funcionariosRoute);
app.use('/contas-pagar', contasPagarRoute);
app.use('/contas-receber', contasReceberRoute);
app.use('/relatorios', relatoriosRoute);
app.use('/clientes', clientesRoute);



app.listen(3000, (error) => {
  if (error){
    console.log("Falha na conexão: " + error);
    return;
  }
    console.log("Servidor rodando na porta 3000!");
  });