const db = require('../db/mysql');

class Carrinho{
    static async obterItens(clienteId, sessionId = null) {
    let query = `
      SELECT c.*, p.nome, p.marca, p.categoria, p.tamanho, p.cor, p.preco_venda,
             (c.quantidade * p.preco_venda) as subtotal
      FROM carrinho c
      JOIN produtos p ON c.produto_id = p.id
      WHERE p.status = 'ativo'
    `;
    let params = [];

    if (clienteId) {
      query += ' AND c.cliente_id = ?';
      params.push(clienteId);
    } else if (sessionId) {
      query += ' AND c.session_id = ?';
      params.push(sessionId);
    }

    query += ' ORDER BY c.created_at DESC';

    const [rows] = await db.execute(query, params);
    return rows;
  }

  static async adicionarItem(item) {
    let checkQuery = 'SELECT id, quantidade FROM carrinho WHERE produto_id = ?';
    let checkParams = [item.produto_id];

    if (item.cliente_id) {
      checkQuery += ' AND cliente_id = ?';
      checkParams.push(item.cliente_id);
    } else {
      checkQuery += ' AND session_id = ?';
      checkParams.push(item.session_id);
    }

    const [existing] = await db.execute(checkQuery, checkParams);

    if (existing.length > 0) {
      const [result] = await db.execute(`
        UPDATE carrinho SET quantidade = quantidade + ? WHERE id = ?
      `, [item.quantidade, existing[0].id]);
      return existing[0].id;
    } else {
      const [result] = await db.execute(`
        INSERT INTO carrinho (cliente_id, session_id, produto_id, quantidade)
        VALUES (?, ?, ?, ?)
      `, [item.cliente_id, item.session_id, item.produto_id, item.quantidade]);
      return result.insertId;
    }
  }

  static async atualizarQuantidade(id, quantidade) {
    const [result] = await db.execute(`
      UPDATE carrinho SET quantidade = ? WHERE id = ?
    `, [quantidade, id]);
    return result.affectedRows > 0;
  }

  static async removerItem(id) {
    const [result] = await db.execute('DELETE FROM carrinho WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async limparCarrinho(clienteId, sessionId = null) {
    let query = 'DELETE FROM carrinho WHERE ';
    let params = [];

    if (clienteId) {
      query += 'cliente_id = ?';
      params.push(clienteId);
    } else {
      query += 'session_id = ?';
      params.push(sessionId);
    }

    const [result] = await db.execute(query, params);
    return result.affectedRows;
  }

  static async obterResumo(clienteId, sessionId = null) {
    const itens = await this.obterItens(clienteId, sessionId);
    
    const total = itens.reduce((sum, item) => sum + item.subtotal, 0);
    const quantidadeTotal = itens.reduce((sum, item) => sum + item.quantidade, 0);

    return {
      itens,
      quantidade_total: quantidadeTotal,
      valor_total: total
    };
  }
}
module.exports = Carrinho;