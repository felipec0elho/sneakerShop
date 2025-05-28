// models/usuarioModel.js
const pool = require('../db/mysql');
class Produto{
  static async listar() {

    const [rows] = await db.execute(`
    SELECT *
    FROM produtos p 
    WHERE p.status = 'ativo'
    ORDER BY p.nome`);
    return rows;

  }
  static async buscarPorId(id) {

      const [rows] = await db.execute(`SELECT * 
          FROM produtos p 
          WHERE p.id = ? AND p.status = 'ativo' 
          ORDER BY p.id`, [id]);
      return rows[0];
  }
  static async buscarPorNome(nome) {
      const [rows] = await db.execute(`SELECT * FROM produtos p WHERE p.nome LIKE ? AND p.status = 'ativo'`, [nome]);
      return rows[0];
  }
  static async criarProduto(usuario, senha_hash) {
    const [result] = await db.execute(`
          INSERT INTO produtos (nome, descricao, marca, categoria, tamanho, cor, preco_custo, preco_venda, fornecedor_id)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [produto.nome, produto.descricao, produto.marca, produto.categoria,produto.tamanho, produto.cor, produto.preco_custo, produto.preco_venda, produto.fornecedor_id]);
    
    await db.execute(`
          INSERT INTO inventario (produto_id, quantidade_atual, quantidade_minima, quantidade_maxima)
          VALUES (?, 0, 5, 100)`, [result.insertId]);
  }
  static async atualizar(id, produto) {
      const [result] = await db.execute(`
        UPDATE produtos 
        SET nome = ?, descricao = ?, marca = ?, categoria = ?, tamanho = ?, cor = ?, 
            preco_custo = ?, preco_venda = ?, fornecedor_id = ?
        WHERE id = ?
      `, [produto.nome, produto.descricao, produto.marca, produto.categoria,
          produto.tamanho, produto.cor, produto.preco_custo, produto.preco_venda, 
          produto.fornecedor_id, id]);
      return result.affectedRows > 0;
    }
  static async excluir(id) {
      const [result] = await db.execute('UPDATE produtos SET status = "inativo" WHERE id = ?', [id]);
      return result.affectedRows > 0;
    }
}

module.exports = Produto;