const db = require('../db/mysql');
class Inventario{
    static async listar(){
    const [rows] = await db.execute(`
    SELECT *, p.nome, p.id, p.marca, p.descricao, p.tamanho, p.cor
    FROM inventario i
    JOIN produtos p ON i.produto_id = p.id 
    WHERE p.status = 'ativo'
    ORDER BY p.nome`);
    return rows;
  }
    static async buscarPorId(id) {
    const [rows] = await db.execute(`
      SELECT *, p.nome, p.id, p.marca, p.descricao, p.tamanho, p.cor
      FROM inventario i
      JOIN produtos p ON i.produto_id = p.id
      WHERE i.id = ? AND p.status = 'ativo'
    `, [id]);
    return rows[0];
  }
    static async atualizarQuantidade(produto_id, quantidade, tipo, motivo, funcionarioId) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      
      if (tipo === 'entrada') {
        await connection.execute(`
          UPDATE inventario SET quantidade_atual = quantidade_atual + ?, ultima_movimentacao = NOW()
          WHERE produto_id = ?
        `, [quantidade, produto_id]);
      } else if (tipo === 'saida') {
        await connection.execute(`
          UPDATE inventario SET quantidade_atual = quantidade_atual - ?, ultima_movimentacao = NOW()
          WHERE produto_id = ?
        `, [quantidade, produto_id]);
      } else if (tipo === 'ajuste') {
        await connection.execute(`
          UPDATE inventario SET quantidade_atual = ?, ultima_movimentacao = NOW()
          WHERE produto_id = ?
        `, [quantidade, produto_id]);
      }
      
      await connection.execute(`
        INSERT INTO movimentacoes_estoque (produto_id, tipo, quantidade, motivo, funcionario_id)
        VALUES (?, ?, ?, ?, ?)
      `, [produto_id, tipo, quantidade, motivo, funcionarioId]);
      
      return true;
    } catch (error) {
      throw error;
    }
  }
  static async obterMovimentacoes(produto_id = null) {
    let query = `
      SELECT me.*, p.nome as produto_nome, f.nome as funcionario_nome
      FROM movimentacoes_estoque me
      JOIN produtos p ON me.produto_id = p.id
      LEFT JOIN funcionarios f ON me.funcionario_id = f.id
    `;
    let params = [];
    
    if (produto_id) {
      query += ' WHERE me.produto_id = ?';
      params.push(produto_id);
    }
    
    query += ' ORDER BY me.data_movimentacao DESC';
    
    const [rows] = await db.execute(query, params);
    return rows;
  }

  static async obterProdutosBaixoEstoque() {
    const [rows] = await db.execute(`
      SELECT i.*, p.nome, p.marca, p.categoria
      FROM inventario i
      JOIN produtos p ON i.produto_id = p.id
      WHERE i.quantidade_atual <= i.quantidade_minima AND p.status = 'ativo'
      ORDER BY i.quantidade_atual ASC
    `);
    return rows;
  }

}
  module.exports = Inventario;
