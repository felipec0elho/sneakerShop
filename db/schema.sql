CREATE DATABASE IF NOT EXISTS sneakershop;
USE sneakershop;

-- Tabela de Funcionários
CREATE TABLE funcionarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  cargo ENUM('admin', 'vendedor', 'estoquista') NOT NULL,
  salario DECIMAL(10,2),
  data_admissao DATE NOT NULL,
  status ENUM('ativo', 'inativo') DEFAULT 'ativo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de Fornecedores
CREATE TABLE fornecedores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  cnpj VARCHAR(14) UNIQUE NOT NULL,
  email VARCHAR(100),
  telefone VARCHAR(15),
  endereco TEXT,
  status ENUM('ativo', 'inativo') DEFAULT 'ativo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Materiais/Produtos
CREATE TABLE materiais (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  marca VARCHAR(50) NOT NULL,
  categoria ENUM('casual', 'esportivo', 'social', 'infantil') NOT NULL,
  tamanho VARCHAR(10) NOT NULL,
  cor VARCHAR(30) NOT NULL,
  preco_custo DECIMAL(10,2) NOT NULL,
  preco_venda DECIMAL(10,2) NOT NULL,
  fornecedor_id INT,
  status ENUM('ativo', 'inativo') DEFAULT 'ativo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id)
);

-- Tabela de Inventário/Estoque
CREATE TABLE inventario (
  id INT PRIMARY KEY AUTO_INCREMENT,
  material_id INT NOT NULL,
  quantidade_atual INT NOT NULL DEFAULT 0,
  quantidade_minima INT NOT NULL DEFAULT 5,
  quantidade_maxima INT NOT NULL DEFAULT 100,
  localizacao VARCHAR(50),
  ultima_movimentacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (material_id) REFERENCES materiais(id),
  UNIQUE KEY unique_material (material_id)
);

-- Tabela de Movimentações de Estoque
CREATE TABLE movimentacoes_estoque (
  id INT PRIMARY KEY AUTO_INCREMENT,
  material_id INT NOT NULL,
  tipo ENUM('entrada', 'saida', 'ajuste') NOT NULL,
  quantidade INT NOT NULL,
  motivo VARCHAR(100),
  funcionario_id INT,
  data_movimentacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (material_id) REFERENCES materiais(id),
  FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id)
);

-- Tabela de Clientes
CREATE TABLE clientes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  telefone VARCHAR(15),
  cpf VARCHAR(11) UNIQUE,
  endereco TEXT,
  data_nascimento DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Vendas
CREATE TABLE vendas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  cliente_id INT,
  funcionario_id INT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  desconto DECIMAL(10,2) DEFAULT 0,
  status ENUM('carrinho', 'pendente', 'confirmada', 'paga', 'entregue', 'cancelada') DEFAULT 'pendente',
  forma_pagamento ENUM('dinheiro', 'cartao_credito', 'cartao_debito', 'pix', 'boleto') NOT NULL,
  observacoes TEXT,
  data_venda TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_entrega DATE,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id),
  FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id)
);

-- Tabela de Itens da Venda
CREATE TABLE itens_venda (
  id INT PRIMARY KEY AUTO_INCREMENT,
  venda_id INT NOT NULL,
  material_id INT NOT NULL,
  quantidade INT NOT NULL,
  preco_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (venda_id) REFERENCES vendas(id) ON DELETE CASCADE,
  FOREIGN KEY (material_id) REFERENCES materiais(id)
);

-- Tabela de Carrinho de Compras
CREATE TABLE carrinho (
  id INT PRIMARY KEY AUTO_INCREMENT,
  cliente_id INT,
  session_id VARCHAR(100),
  material_id INT NOT NULL,
  quantidade INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id),
  FOREIGN KEY (material_id) REFERENCES materiais(id)
);

-- Tabela de Contas a Pagar
CREATE TABLE contas_pagar (
  id INT PRIMARY KEY AUTO_INCREMENT,
  fornecedor_id INT NOT NULL,
  descricao VARCHAR(200) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  status ENUM('pendente', 'paga', 'vencida') DEFAULT 'pendente',
  categoria ENUM('mercadoria', 'aluguel', 'energia', 'agua', 'telefone', 'outros') NOT NULL,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id)
);

-- Tabela de Contas a Receber
CREATE TABLE contas_receber (
  id INT PRIMARY KEY AUTO_INCREMENT,
  venda_id INT,
  cliente_id INT,
  descricao VARCHAR(200) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  data_vencimento DATE NOT NULL,
  data_recebimento DATE,
  status ENUM('pendente', 'recebida', 'vencida') DEFAULT 'pendente',
  forma_recebimento ENUM('dinheiro', 'cartao_credito', 'cartao_debito', 'pix', 'boleto'),
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (venda_id) REFERENCES vendas(id),
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

-- Inserir dados iniciais
INSERT INTO funcionarios (nome, email, senha, cargo, salario, data_admissao) VALUES
('Admin Sistema', 'admin@sneakershop.com', '$2b$10$hash', 'admin', 5000.00, '2024-01-01'),
('João Vendedor', 'joao@sneakershop.com', '$2b$10$hash', 'vendedor', 2500.00, '2024-01-15'),
('Maria Estoque', 'maria@sneakershop.com', '$2b$10$hash', 'estoquista', 2200.00, '2024-02-01');

INSERT INTO fornecedores (nome, cnpj, email, telefone) VALUES
('Nike', '12345678000101', 'contato@nike.com.br', '11999999999'),
('Adidas', '12345678000102', 'contato@adidas.com.br', '11888888888'),
('Puma', '12345678000103', 'contato@puma.com.br', '11777777777'),
('New Balance', '12345678000104', 'contato@newbalance.com.br', '11666666666');
