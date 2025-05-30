const pool = require('../db/mysql');

class ContasReceber{
    static async listar() {
    const [rows] = await db.execute(`
      SELECT cr.*, c.nome as cliente_nome, v.id as venda_numero
      FROM contas_receber cr
      LEFT JOIN clientes c ON cr.cliente_id = c.id
      LEFT JOIN vendas v ON cr.venda_id = v.id
      ORDER BY cr.data_vencimento ASC
    `);
    return rows;
  }
  static async buscarPorId(id) {
    const [rows] = await db.execute(`
      SELECT cr.*, c.nome as cliente_nome, v.id as venda_numero
      FROM contas_receber cr
      LEFT JOIN clientes c ON cr.cliente_id = c.id
      LEFT JOIN vendas v ON cr.venda_id = v.id
      WHERE cr.id = ?
    `, [id]);
    return rows[0];
  }
  static async atualizar(id, conta) {
    const [result] = await db.execute(`
      UPDATE contas_receber 
      SET venda_id = ?, cliente_id = ?, descricao = ?, valor = ?, 
          data_vencimento = ?, observacoes = ?
      WHERE id = ?
    `, [conta.venda_id, conta.cliente_id, conta.descricao, conta.valor,
        conta.data_vencimento, conta.observacoes, id]);
    
    return result.affectedRows > 0;
  }
  static async marcarComoRecebida(id, formaRecebimento) {
    const [result] = await db.execute(`
      UPDATE contas_receber 
      SET status = 'recebida', data_recebimento = NOW(), forma_recebimento = ?
      WHERE id = ?
    `, [formaRecebimento, id]);
    
    return result.affectedRows > 0;
  }

  static async excluir(id) {
    const [result] = await db.execute('DELETE FROM contas_receber WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async obterContasVencidas() {
    const [rows] = await db.execute(`
      SELECT cr.*, c.nome as cliente_nome
      FROM contas_receber cr
      LEFT JOIN clientes c ON cr.cliente_id = c.id
      WHERE cr.data_vencimento < CURDATE() AND cr.status = 'pendente'
      ORDER BY cr.data_vencimento ASC
    `);
    return rows;
  }

  static async obterContasVencProx(dias = 7) {
    const [rows] = await db.execute(`
      SELECT cr.*, c.nome as cliente_nome
      FROM contas_receber cr
      LEFT JOIN clientes c ON cr.cliente_id = c.id
      WHERE cr.data_vencimento BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY)
        AND cr.status = 'pendente'
      ORDER BY cr.data_vencimento ASC
    `, [dias]);
    return rows;
  }
}
module.exports = ContasReceber;