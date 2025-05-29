const pool = require('../db/mysql');
const bcrypt = require('bcrypt');

class Funcionario{
    static async listar() {
    const [rows] = await db.execute(`
      SELECT id, nome, email, cargo, salario, data_admissao, created_at
      FROM funcionarios
      ORDER BY nome
    `);
    return rows;
  }

  static async buscarPorId(id) {
    const [rows] = await db.execute(`
      SELECT id, nome, email, cargo, salario, data_admissao, created_at
      FROM funcionarios
      WHERE id = ?
    `, [id]);
    return rows[0];
  }

  static async buscarPorEmail(email) {
    const [rows] = await db.execute(`
      SELECT * FROM funcionarios WHERE email = ?
    `, [email]);
    return rows[0];
  }
  static async buscarPorNome(nome) {
    const [rows] = await db.execute(`
      SELECT * FROM funcionarios WHERE nome = ?
    `, [nome]);
    return rows[0];
  }

  static async criar(funcionario) {
    const senhaHash = await bcrypt.hash(funcionario.senha, 10);
    
    const [result] = await db.execute(`
      INSERT INTO funcionarios (nome, email, senha, cargo, salario, data_admissao)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [funcionario.nome, funcionario.email, senhaHash, funcionario.cargo, 
        funcionario.salario, funcionario.data_admissao]);
    
    return result.insertId;
  }

  static async atualizar(id, funcionario) {
    let query = `
      UPDATE funcionarios 
      SET nome = ?, email = ?, cargo = ?, salario = ?, data_admissao = ?
    `;
    let params = [funcionario.nome, funcionario.email, funcionario.cargo, 
                  funcionario.salario, funcionario.data_admissao];

    if (funcionario.senha) {
      const senhaHash = await bcrypt.hash(funcionario.senha, 10);
      query += ', senha = ?';
      params.push(senhaHash);
    }

    query += ' WHERE id = ?';
    params.push(id);

    const [result] = await db.execute(query, params);
    return result.affectedRows > 0;
  }

  static async excluir(id) {
    const [result] = await db.execute(`
        DELETE FROM funcionarios WHERE id = ?`, [id]);
    return result.affectedRows > 0;
    }

  static async validarSenha(email, senha) {
    const funcionario = await this.buscarPorEmail(email);
    if (!funcionario) return null;

    const senhaValida = await bcrypt.compare(senha, funcionario.senha);
    if (!senhaValida) return null;

    const { senha: _, ...funcionarioSemSenha } = funcionario;
    return funcionarioSemSenha;
  }

  static async obterRelatorioVendas(funcionarioId, dataInicio, dataFim) {
    const [rows] = await db.execute(`
      SELECT 
        COUNT(*) as total_vendas,
        SUM(total) as valor_total_vendas,
        AVG(total) as ticket_medio
      FROM vendas 
      WHERE funcionario_id = ? 
        AND data_venda BETWEEN ? AND ?
        AND status IN ('confirmada', 'paga', 'entregue')
    `, [funcionarioId, dataInicio, dataFim]);
    
    return rows[0];
  }
}
  module.exports = Funcionario;