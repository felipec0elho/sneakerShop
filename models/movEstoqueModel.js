const db = require('../db/mysql');

class MovimentacaoEstoque{
    static async listar(filtros = {}) {
    let query = `
      SELECT me.*, p.nome as produto_nome, p.marca, p.categoria, 
             f.nome as funcionario_nome
      FROM movimentacoes_estoque me
      JOIN produtos p ON me.produto_id = p.id
      LEFT JOIN funcionarios f ON me.funcionario_id = f.id
      WHERE 1=1
    `;
    
    let params = [];
    
    if (filtros.produtoId) {
      query += ' AND me.produto_id = ?';
      params.push(filtros.produtoId);
    }
    
    if (filtros.tipo) {
      query += ' AND me.tipo = ?';
      params.push(filtros.tipo);
    }
    
    if (filtros.dataInicio) {
      query += ' AND DATE(me.data_movimentacao) >= ?';
      params.push(filtros.dataInicio);
    }
    
    if (filtros.dataFim) {
      query += ' AND DATE(me.data_movimentacao) <= ?';
      params.push(filtros.dataFim);
    }
    
    if (filtros.funcionarioId) {
      query += ' AND me.funcionario_id = ?';
      params.push(filtros.funcionarioId);
    }
    
    query += ' ORDER BY me.data_movimentacao DESC';
    
    if (filtros.limit) {
      query += ' LIMIT ?';
      params.push(parseInt(filtros.limit));
    }
    
    const [rows] = await db.execute(query, params);
    return rows;
  }

  static async buscarPorId(id) {
    const [rows] = await db.execute(`
      SELECT me.*, p.nome as produto_nome, p.marca, p.categoria,
             f.nome as funcionario_nome
      FROM movimentacoes_estoque me
      JOIN produtos p ON me.produto_id = p.id
      LEFT JOIN funcionarios f ON me.funcionario_id = f.id
      WHERE me.id = ?
    `, [id]);
    return rows[0];
  }

  static async criar(movimentacao) {
    const connection = await db.getConnection();
    await connection.beginTransaction();
    
    const [result] = await connection.execute(`
    INSERT INTO movimentacoes_estoque (produto_id, tipo, quantidade, motivo, funcionario_id)
    VALUES (?, ?, ?, ?, ?)
    `, [movimentacao.produto_id, movimentacao.tipo, movimentacao.quantidade, 
        movimentacao.motivo, movimentacao.funcionario_id]);
    
    if (movimentacao.tipo === 'entrada') {
    await connection.execute(`
        UPDATE inventario 
        SET quantidade_atual = quantidade_atual + ?, ultima_movimentacao = NOW()
        WHERE produto_id = ?
    `, [movimentacao.quantidade, movimentacao.produto_id]);
    } else if (movimentacao.tipo === 'saida') {
    const [estoque] = await connection.execute(`
        SELECT quantidade_atual FROM inventario WHERE produto_id = ?
    `, [movimentacao.produto_id]);
    
    if (estoque[0].quantidade_atual < movimentacao.quantidade) {
        throw new Error('Estoque insuficiente para realizar a saída');
    }
    
    await connection.execute(`
        UPDATE inventario 
        SET quantidade_atual = quantidade_atual - ?, ultima_movimentacao = NOW()
        WHERE produto_id = ?
    `, [movimentacao.quantidade, movimentacao.produto_id]);
    } else if (movimentacao.tipo === 'ajuste') {
    await connection.execute(`
        UPDATE inventario 
        SET quantidade_atual = ?, ultima_movimentacao = NOW()
        WHERE produto_id = ?
    `, [movimentacao.quantidade, movimentacao.produto_id]);
    }
      
  }
  static async obterMovimentacoesPorProduto(produtoId, limite = 50) {
    const [rows] = await db.execute(`
      SELECT me.*, f.nome as funcionario_nome
      FROM movimentacoes_estoque me
      LEFT JOIN funcionarios f ON me.funcionario_id = f.id
      WHERE me.produto_id = ?
      ORDER BY me.data_movimentacao DESC
      LIMIT ?
    `, [produtoId, limite]);
    return rows;
  }

}
module.exports = MovimentacaoEstoque;