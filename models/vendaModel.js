const db = require('../db/mysql');

class Venda {
  static async listar() {
    const [rows] = await db.execute(`
      SELECT v.*, c.nome as cliente_nome, f.nome as funcionario_nome
      FROM vendas v
      LEFT JOIN clientes c ON v.cliente_id = c.id
      JOIN funcionarios f ON v.funcionario_id = f.id
      ORDER BY v.data_venda DESC
    `);
    return rows;
  }

  static async buscarPorId(id) {
    const [vendas] = await db.execute(`
      SELECT v.*, c.nome as cliente_nome, f.nome as funcionario_nome
      FROM vendas v
      LEFT JOIN clientes c ON v.cliente_id = c.id
      JOIN funcionarios f ON v.funcionario_id = f.id
      WHERE v.id = ?
    `, [id]);

    if (vendas.length === 0) return null;

    const venda = vendas[0];

    const [itens] = await db.execute(`
      SELECT iv.*, m.nome as produto_nome, m.marca, m.categoria
      FROM itens_venda iv
      JOIN materiais m ON iv.material_id = m.id
      WHERE iv.venda_id = ?
    `, [id]);

    venda.itens = itens;
    return venda;
  }

  static async criar(venda) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.execute(`
        INSERT INTO vendas (cliente_id, funcionario_id, total, desconto, status, forma_pagamento, observacoes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [venda.cliente_id, venda.funcionario_id, venda.total, venda.desconto || 0, 
          venda.status || 'pendente', venda.forma_pagamento, venda.observacoes]);

      const vendaId = result.insertId;

      for (const item of venda.itens) {
        await connection.execute(`
          INSERT INTO itens_venda (venda_id, material_id, quantidade, preco_unitario, subtotal)
          VALUES (?, ?, ?, ?, ?)
        `, [vendaId, item.material_id, item.quantidade, item.preco_unitario, item.subtotal]);

        await connection.execute(`
          UPDATE inventario SET quantidade_atual = quantidade_atual - ?
          WHERE material_id = ?
        `, [item.quantidade, item.material_id]);

        await connection.execute(`
          INSERT INTO movimentacoes_estoque (material_id, tipo, quantidade, motivo, funcionario_id)
          VALUES (?, 'saida', ?, 'Venda', ?)
        `, [item.material_id, item.quantidade, venda.funcionario_id]);
      }

      if (venda.status === 'confirmada' && venda.forma_pagamento !== 'dinheiro') {
        await connection.execute(`
          INSERT INTO contas_receber (venda_id, cliente_id, descricao, valor, data_vencimento, status)
          VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY), 'pendente')
        `, [vendaId, venda.cliente_id, `Venda #${vendaId}`, venda.total]);
      }
      return vendaId;
    } catch (error) {
      throw error;
    } 
  }

  static async atualizarStatus(id, novoStatus) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.execute(`
        UPDATE vendas SET status = ? WHERE id = ?
      `, [novoStatus, id]);

      if (novoStatus === 'cancelada') {
        const [itens] = await connection.execute(`
          SELECT material_id, quantidade FROM itens_venda WHERE venda_id = ?
        `, [id]);

        for (const item of itens) {
          await connection.execute(`
            UPDATE inventario SET quantidade_atual = quantidade_atual + ?
            WHERE material_id = ?
          `, [item.quantidade, item.material_id]);
        }

        await connection.execute(`
          UPDATE contas_receber SET status = 'cancelada' WHERE venda_id = ?
        `, [id]);
      }

      if (novoStatus === 'paga') {
        await connection.execute(`
          UPDATE contas_receber SET status = 'recebida', data_recebimento = NOW() WHERE venda_id = ?
        `, [id]);
      }

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    } 
  }

  static async obterVendasPorPeriodo(dataInicio, dataFim) {
    const [rows] = await db.execute(`
      SELECT v.*, c.nome as cliente_nome
      FROM vendas v
      LEFT JOIN clientes c ON v.cliente_id = c.id
      WHERE v.data_venda BETWEEN ? AND ?
      ORDER BY v.data_venda DESC
    `, [dataInicio, dataFim]);
    return rows;
  }
}

module.exports = Venda;
