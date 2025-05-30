const db = require('../config/database');

class ContasPagar{
    static async listar() {
    const [rows] = await db.execute(`
      SELECT cp.*, c.nome as cliente_nome, v.id as venda_numero
      FROM contas_pagar cp
      LEFT JOIN clientes c ON cp.cliente_id = c.id
      LEFT JOIN vendas v ON cp.venda_id = v.id
      ORDER BY cp.data_vencimento ASC
    `);
    return rows;
  }
  static async buscarPorId(id) {
    const [rows] = await db.execute(`
      SELECT cp.*, c.nome as cliente_nome, v.id as venda_numero
      FROM contas_pagar cp
      LEFT JOIN clientes c ON cp.cliente_id = c.id
      LEFT JOIN vendas v ON cp.venda_id = v.id
      WHERE cp.id = ?
    `, [id]);
    return rows[0];
  }
  static async atualizar(id, conta) {
    const [result] = await db.execute(`
      UPDATE contas_pagar 
      SET venda_id = ?, cliente_id = ?, descricao = ?, valor = ?, 
          data_vencimento = ?, observacoes = ?
      WHERE id = ?
    `, [conta.venda_id, conta.cliente_id, conta.descricao, conta.valor,
        conta.data_vencimento, conta.observacoes, id]);
    
    return result.affectedRows > 0;
  }
  static async marcarComoPaga(id) {
    const [result] = await db.execute(`
      UPDATE contas_pagar 
      SET status = 'paga', data_pagamento = NOW() = ?
      WHERE id = ?
    `, [id]);
    
    return result.affectedRows > 0;
  }

  static async excluir(id) {
    const [result] = await db.execute('DELETE FROM contas_pagar WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async obterContasVencidas() {
    const [rows] = await db.execute(`
      SELECT cp.*, c.nome as cliente_nome
      FROM contas_pagar cp
      LEFT JOIN clientes c ON cp.cliente_id = c.id
      WHERE cp.data_vencimento < CURDATE() AND cp.status = 'pendente'
      ORDER BY cp.data_vencimento ASC
    `);
    return rows;
  }

  static async obterContasVencProx(dias = 7) {
    const [rows] = await db.execute(`
      SELECT cp.*, c.nome as cliente_nome
      FROM contas_pagar cp
      LEFT JOIN clientes c ON cp.cliente_id = c.id
      WHERE cp.data_vencimento BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY)
        AND cp.status = 'pendente'
      ORDER BY cp.data_vencimento ASC
    `, [dias]);
    return rows;
  }
}
module.exports = ContasPagar;