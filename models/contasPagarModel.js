const db = require('../db/mysql');

class ContasPagar{
    static async listar() {
        const [rows] = await db.execute(`
            SELECT cp.*, f.nome as fornecedor_nome
            FROM contas_pagar cp
            LEFT JOIN fornecedores f ON cp.fornecedor_id = f.id
            ORDER BY cp.data_vencimento ASC
        `);
        return rows;
    }

    static async buscarPorId(id) {
        const [rows] = await db.execute(`
            SELECT cp.*, f.nome as fornecedor_nome
            FROM contas_pagar cp
            LEFT JOIN fornecedores f ON cp.fornecedor_id = f.id
            WHERE cp.id = ?
        `, [id]);
        return rows[0];
    }

    static async criar(conta) {
        const [result] = await db.execute(`
            INSERT INTO contas_pagar (fornecedor_id, descricao, valor, data_vencimento, categoria, observacoes)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [conta.fornecedor_id, conta.descricao, conta.valor, conta.data_vencimento, conta.categoria, conta.observacoes]);
        
        return result.insertId;
    }

    static async atualizar(id, conta) {
        const [result] = await db.execute(`
            UPDATE contas_pagar 
            SET fornecedor_id = ?, descricao = ?, valor = ?, 
                data_vencimento = ?, categoria = ?, observacoes = ?
            WHERE id = ?
        `, [conta.fornecedor_id, conta.descricao, conta.valor,
            conta.data_vencimento, conta.categoria, conta.observacoes, id]);
        
        return result.affectedRows > 0;
    }

    static async marcarComoPaga(id) {
        const [result] = await db.execute(`
            UPDATE contas_pagar 
            SET status = 'paga', data_pagamento = NOW()
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
            SELECT cp.*, f.nome as fornecedor_nome
            FROM contas_pagar cp
            LEFT JOIN fornecedores f ON cp.fornecedor_id = f.id
            WHERE cp.data_vencimento < CURDATE() AND cp.status = 'pendente'
            ORDER BY cp.data_vencimento ASC
        `);
        return rows;
    }

    static async obterContasVencProx(dias = 7) {
        const [rows] = await db.execute(`
            SELECT cp.*, f.nome as fornecedor_nome
            FROM contas_pagar cp
            LEFT JOIN fornecedores f ON cp.fornecedor_id = f.id
            WHERE cp.data_vencimento BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY)
                AND cp.status = 'pendente'
            ORDER BY cp.data_vencimento ASC
        `, [dias]);
        return rows;
    }
}
module.exports = ContasPagar;