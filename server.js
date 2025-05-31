const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));


const produtosRoute = require('./routers/produtosRoute');
const inventarioRoute = require('./routers/inventarioRoute');
const vendasRoute = require('./routers/vendasRoute');
const carrinhoRoute = require('./routers/carrinhoRoute');
const funcionariosRoute = require('./routers/funcionariosRoute');
const contasPagarRoute = require('./routers/contasPagarRoute');
const contasReceberRoute = require('./routers/contasReceberRoute');
const clientesRoute = require('./routers/clientesRoute');
const movEstoqueRoute = require('./routers/movEstoqueRoute');
const itensVendaRoute = require('./routers/itensVendaRoute');


app.use ('/produtos', produtosRoute);
app.use('/inventario', inventarioRoute);
app.use('/carrinho', carrinhoRoute);
app.use('/vendas', vendasRoute);
app.use('/funcionarios', funcionariosRoute);
app.use('/contas-pagar', contasPagarRoute);
app.use('/contas-receber', contasReceberRoute);
app.use('/clientes', clientesRoute);
app.use('/movEstoque', movEstoqueRoute);
app.use('/itensVenda', itensVendaRoute);


app.listen(3000, (error) => {
  if (error){
    console.log("Falha na conexão: " + error);
    return;
  }
    console.log("Servidor rodando na porta 3000!");
  });