const db = require('../db/mysql');

class Fornecedor{
    static async listar() {
    const [rows] = await db.execute(`
      SELECT * FROM fornecedores 
      WHERE status = 'ativo' 
      ORDER BY nome
    `);
    return rows;
  }

  static async buscarPorId(id) {
    const [rows] = await db.execute(`
      SELECT * FROM fornecedores 
      WHERE id = ? AND status = 'ativo'
    `, [id]);
    return rows[0];
  }

  static async buscarPorCnpj(cnpj) {
    const [rows] = await db.execute(`
      SELECT * FROM fornecedores 
      WHERE cnpj = ? AND status = 'ativo'
    `, [cnpj]);
    return rows[0];
  }

  static async criar(fornecedor) {
    const existente = await this.buscarPorCnpj(fornecedor.cnpj);
    if (existente) {
      throw new Error('CNPJ já cadastrado');
    }

    const [result] = await db.execute(`
      INSERT INTO fornecedores (nome, cnpj, email, telefone, endereco)
      VALUES (?, ?, ?, ?, ?)
    `, [fornecedor.nome, fornecedor.cnpj, fornecedor.email, 
        fornecedor.telefone, fornecedor.endereco]);
    
    return result.insertId;
  }

  static async atualizar(id, fornecedor) {
    const [existente] = await db.execute(`
      SELECT id FROM fornecedores 
      WHERE cnpj = ? AND id != ? AND status = 'ativo'
    `, [fornecedor.cnpj, id]);
    
    if (existente.length > 0) {
      throw new Error('CNPJ já cadastrado para outro fornecedor');
    }

    const [result] = await db.execute(`
      UPDATE fornecedores 
      SET nome = ?, cnpj = ?, email = ?, telefone = ?, endereco = ?
      WHERE id = ?
    `, [fornecedor.nome, fornecedor.cnpj, fornecedor.email,
        fornecedor.telefone, fornecedor.endereco, id]);
    
    return result.affectedRows > 0;
  }

  static async excluir(id) {
    const [produtos] = await db.execute(`
      SELECT COUNT(*) as total FROM produtos 
      WHERE fornecedor_id = ? AND status = 'ativo'
    `, [id]);
    
    if (produtos[0].total > 0) {
      throw new Error('Não é possível excluir fornecedor com produtos cadastrados');
    }

    const [result] = await db.execute(`
      UPDATE fornecedores SET status = 'inativo' WHERE id = ?
    `, [id]);
    
    return result.affectedRows > 0;
  }

}
module.exports = Fornecedor;