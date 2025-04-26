const express = require('express');
const app = express();
app.use(express.json());
const server = express();


const produtosRoute = require('./routers/produtosRoute');
app.use ('/produtos', produtosRoute);
app.use (produtosRoute)

app.listen(3000, (error) => {
  if (error){
    console.log("Falha na conexão");
    return;
  }
    console.log("Servidor rodando na porta 3000!");
  });

