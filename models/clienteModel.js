const db = require('../db/mysql');

class Cliente {

  static async listar() {
    try {
      const [rows] = await db.execute(`   
        SELECT * 
        FROM clientes 
        ORDER BY nome`
      );
      return rows;
    } catch (error) {
      throw new Error(`Erro ao buscar clientes: ${error.message}`);
    }
  }

  static async buscarPorId(id) {
    try {
      const [rows] = await db.execute(`
        SELECT * 
        FROM clientes 
        WHERE id = ?
        ORDER BY nome`,[id]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Erro ao buscar cliente: ${error.message}`);
    }
  }

  static async buscarPorEmail(email) {
    try {
      const [rows] = await db.execute(`
        SELECT * 
        FROM clientes 
        WHERE email = ?
        ORDER BY nome`,
        [email]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Erro ao buscar cliente por email: ${error.message}`);
    }
  }
 static async criar(cliente) {
    const [result] = await db.execute(`
    INSERT INTO clientes (nome, email, telefone, cpf, endereco, data_nascimento) 
    VALUES (?, ?, ?, ?, ?, ?)`,
    [cliente.nome, cliente.email, cliente.telefone, cliente.cpf, cliente.endereco, cliente.data_nascimento]
      );
      
  }

  static async update(id, cliente) {

    const [result] = await db.execute(`
    UPDATE clientes 
    SET nome = ?, email = ?, telefone = ?, cpf = ?, endereco = ?, data_nascimento = ? 
    WHERE id = ?`,
    [cliente.nome, cliente.email, cliente.telefone, cliente.cpf, cliente.endereco, cliente.data_nascimento, cliente.id]
    );
    return result.affectedRows > 0;            
  }

  static async delete(id) {
    try {
      const [result] = await db.execute(
        'DELETE FROM clientes WHERE id = ?',
        [id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Erro ao deletar cliente: ${error.message}`);
    }
  }
}
module.exports = Cliente;