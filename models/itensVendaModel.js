const pool = require('../db/mysql');
class ItensVenda {
  static async listarPorVenda(vendaId) {
    const [rows] = await db.execute(`
      SELECT iv.*, p.nome as produto_nome, p.marca, p.categoria, 
             p.cor, p.tamanho, p.preco_venda as preco_atual
      FROM itens_venda iv
      JOIN produtos p ON iv.produto_id = p.id
      WHERE iv.venda_id = ?
      ORDER BY iv.id
    `, [vendaId]);
    return rows;
  }

  static async buscarPorId(id) {
    const [rows] = await db.execute(`
      SELECT iv.*, p.nome as produto_nome, p.marca, p.categoria,
             p.cor, p.tamanho, v.data_venda, v.status as status_venda
      FROM itens_venda iv
      JOIN produtos p ON iv.produto_id = p.id
      JOIN vendas v ON iv.venda_id = v.id
      WHERE iv.id = ?
    `, [id]);
    return rows[0];
  }

  static async criar(item) {
    const [result] = await db.execute(`
      INSERT INTO itens_venda (venda_id, produto_id, quantidade, preco_unitario, subtotal)
      VALUES (?, ?, ?, ?, ?)
    `, [item.venda_id, item.produto_id, item.quantidade, 
        item.preco_unitario, item.subtotal]);
    return result.insertId;
  }

  static async atualizar(id, item) {
    const [result] = await db.execute(`
      UPDATE itens_venda 
      SET quantidade = ?, preco_unitario = ?, subtotal = ?
      WHERE id = ?
    `, [item.quantidade, item.preco_unitario, item.subtotal, id]);
    return result.affectedRows > 0;
  }

  static async excluir(id) {
    const [result] = await db.execute('DELETE FROM itens_venda WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}
module.exports = ItensVenda;
