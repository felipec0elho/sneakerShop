CREATE DATABASE IF NOT EXISTS sneakershop;
USE sneakershop;

CREATE TABLE funcionarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  cargo ENUM('admin', 'vendedor', 'estoquista') NOT NULL,
  salario DECIMAL(10,2),
  data_admissao DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

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

CREATE TABLE produtos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  marca VARCHAR(50) NOT NULL,
  categoria ENUM('casual', 'esportivo', 'infantil') NOT NULL,
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

CREATE TABLE inventario (
  id INT PRIMARY KEY AUTO_INCREMENT,
  produto_id INT NOT NULL,
  quantidade_atual INT NOT NULL DEFAULT 0,
  quantidade_minima INT NOT NULL DEFAULT 5,
  quantidade_maxima INT NOT NULL DEFAULT 100,
  localizacao VARCHAR(50),
  ultima_movimentacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (produto_id) REFERENCES produtos(id),
  UNIQUE KEY unique_produto (produto_id)
);

CREATE TABLE movimentacoes_estoque (
  id INT PRIMARY KEY AUTO_INCREMENT,
  produto_id INT NOT NULL,
  tipo ENUM('entrada', 'saida', 'ajuste') NOT NULL,
  quantidade INT NOT NULL,
  motivo VARCHAR(100),
  funcionario_id INT,
  data_movimentacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (produto_id) REFERENCES produtos(id),
  FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id)
);

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

CREATE TABLE itens_venda (
  id INT PRIMARY KEY AUTO_INCREMENT,
  venda_id INT NOT NULL,
  produto_id INT NOT NULL,
  quantidade INT NOT NULL,
  preco_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (venda_id) REFERENCES vendas(id) ON DELETE CASCADE,
  FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

CREATE TABLE carrinho (
  id INT PRIMARY KEY AUTO_INCREMENT,
  cliente_id INT,
  session_id VARCHAR(100),
  produto_id INT NOT NULL,
  quantidade INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id),
  FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

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

INSERT INTO funcionarios (nome, email, senha, cargo, salario, data_admissao) VALUES
('Admin Sistema', 'admin@sneakershop.com', '$2b$10$hash', 'admin', 5000.00, '2024-01-01'),
('João Vendedor', 'joao@sneakershop.com', '$2b$10$hash', 'vendedor', 2500.00, '2024-01-15'),
('Maria Estoque', 'maria@sneakershop.com', '$2b$10$hash', 'estoquista', 2200.00, '2024-02-01');

INSERT INTO fornecedores (nome, cnpj, email, telefone) VALUES
('Nike', '12345678000101', 'contato@nike.com.br', '11999999999'),
('Adidas', '12345678000102', 'contato@adidas.com.br', '11888888888'),
('Puma', '12345678000103', 'contato@puma.com.br', '11777777777'),
('New Balance', '12345678000104', 'contato@newbalance.com.br', '11666666666');

INSERT INTO produtos (nome, descricao, marca, categoria, tamanho, cor, preco_custo, preco_venda, fornecedor_id) VALUES
('Air Max 90', 'Tênis clássico com amortecimento Air Max', 'Nike', 'casual', '40', 'Branco', 280.00, 450.00, 1),
('Air Max 90', 'Tênis clássico com amortecimento Air Max', 'Nike', 'casual', '41', 'Branco', 280.00, 450.00, 1),
('Air Max 90', 'Tênis clássico com amortecimento Air Max', 'Nike', 'casual', '42', 'Preto', 280.00, 450.00, 1),
('Air Force 1', 'Tênis icônico de basquete', 'Nike', 'casual', '39', 'Branco', 320.00, 520.00, 1),
('Air Force 1', 'Tênis icônico de basquete', 'Nike', 'casual', '40', 'Preto', 320.00, 520.00, 1),
('Stan Smith', 'Tênis clássico minimalista', 'Adidas', 'casual', '38', 'Branco', 250.00, 400.00, 2),
('Stan Smith', 'Tênis clássico minimalista', 'Adidas', 'casual', '39', 'Verde', 250.00, 400.00, 2),
('Ultraboost 22', 'Tênis de corrida com tecnologia Boost', 'Adidas', 'esportivo', '41', 'Preto', 380.00, 650.00, 2),
('Ultraboost 22', 'Tênis de corrida com tecnologia Boost', 'Adidas', 'esportivo', '42', 'Azul', 380.00, 650.00, 2),
('Suede Classic', 'Tênis casual em camurça', 'Puma', 'casual', '40', 'Azul', 180.00, 300.00, 3),
('Suede Classic', 'Tênis casual em camurça', 'Puma', 'casual', '41', 'Vermelho', 180.00, 300.00, 3),
('RS-X', 'Tênis chunky com design futurista', 'Puma', 'casual', '39', 'Multicolor', 220.00, 380.00, 3),
('Fresh Foam X', 'Tênis de corrida com amortecimento', 'New Balance', 'esportivo', '40', 'Cinza', 300.00, 500.00, 4),
('Fresh Foam X', 'Tênis de corrida com amortecimento', 'New Balance', 'esportivo', '41', 'Preto', 300.00, 500.00, 4),
('Air Max 270 Kids', 'Tênis infantil com Air Max', 'Nike', 'infantil', '28', 'Rosa', 200.00, 350.00, 1),
('Air Max 270 Kids', 'Tênis infantil com Air Max', 'Nike', 'infantil', '30', 'Azul', 200.00, 350.00, 1),
('Forum Low Kids', 'Tênis infantil clássico', 'Adidas', 'infantil', '29', 'Branco', 150.00, 280.00, 2),
('Cali Sport Kids', 'Tênis infantil esportivo', 'Puma', 'infantil', '31', 'Pink', 140.00, 250.00, 3);

INSERT INTO inventario (produto_id, quantidade_atual, quantidade_minima, quantidade_maxima, localizacao) VALUES
(1, 25, 5, 50, 'Prateleira A1'),
(2, 18, 5, 50, 'Prateleira A2'),
(3, 12, 5, 50, 'Prateleira A3'),
(4, 30, 5, 60, 'Prateleira B1'),
(5, 22, 5, 60, 'Prateleira B2'),
(6, 15, 5, 40, 'Prateleira C1'),
(7, 8, 5, 40, 'Prateleira C2'),
(8, 20, 5, 45, 'Prateleira D1'),
(9, 16, 5, 45, 'Prateleira D2'),
(10, 35, 10, 70, 'Prateleira E1'),
(11, 28, 10, 70, 'Prateleira E2'),
(12, 14, 5, 35, 'Prateleira F1'),
(13, 19, 5, 50, 'Prateleira G1'),
(14, 11, 5, 50, 'Prateleira G2'),
(15, 40, 15, 80, 'Prateleira H1'),
(16, 35, 15, 80, 'Prateleira H2'),
(17, 25, 10, 60, 'Prateleira I1'),
(18, 20, 10, 50, 'Prateleira I2');

INSERT INTO movimentacoes_estoque (produto_id, tipo, quantidade, motivo, funcionario_id, data_movimentacao) VALUES
(1, 'entrada', 30, 'Compra inicial', 3, '2024-01-15 10:00:00'),
(2, 'entrada', 25, 'Compra inicial', 3, '2024-01-15 10:15:00'),
(3, 'entrada', 20, 'Compra inicial', 3, '2024-01-15 10:30:00'),
(1, 'saida', 5, 'Venda', 2, '2024-01-20 14:30:00'),
(4, 'entrada', 35, 'Reposição de estoque', 3, '2024-01-25 09:00:00'),
(5, 'entrada', 30, 'Reposição de estoque', 3, '2024-01-25 09:15:00'),
(3, 'saida', 8, 'Venda', 2, '2024-02-01 16:20:00'),
(8, 'entrada', 25, 'Nova coleção', 3, '2024-02-05 11:00:00'),
(9, 'entrada', 20, 'Nova coleção', 3, '2024-02-05 11:15:00'),
(10, 'entrada', 40, 'Promoção fornecedor', 3, '2024-02-10 08:30:00');

INSERT INTO clientes (nome, email, telefone, cpf, endereco, data_nascimento) VALUES
('Carlos Silva', 'carlos.silva@email.com', '11987654321', '12345678901', 'Rua das Flores, 123 - São Paulo/SP', '1985-03-15'),
('Ana Santos', 'ana.santos@email.com', '11876543210', '12345678902', 'Av. Paulista, 456 - São Paulo/SP', '1990-07-22'),
('Pedro Oliveira', 'pedro.oliveira@email.com', '11765432109', '12345678903', 'Rua Augusta, 789 - São Paulo/SP', '1988-11-10'),
('Mariana Costa', 'mariana.costa@email.com', '11654321098', '12345678904', 'Rua Oscar Freire, 321 - São Paulo/SP', '1992-01-05'),
('Felipe Rodriguez', 'felipe.rodriguez@email.com', '11543210987', '12345678905', 'Av. Rebouças, 654 - São Paulo/SP', '1987-09-30'),
('Camila Ferreira', 'camila.ferreira@email.com', '11432109876', '12345678906', 'Rua Haddock Lobo, 987 - São Paulo/SP', '1995-04-18'),
('Lucas Mendes', 'lucas.mendes@email.com', '11321098765', '12345678907', 'Av. Faria Lima, 147 - São Paulo/SP', '1989-12-03'),
('Juliana Alves', 'juliana.alves@email.com', '11210987654', '12345678908', 'Rua Consolação, 258 - São Paulo/SP', '1993-06-28');

INSERT INTO vendas (cliente_id, funcionario_id, total, desconto, status, forma_pagamento, observacoes, data_venda) VALUES
(1, 2, 450.00, 0.00, 'paga', 'cartao_credito', 'Cliente fidelizado', '2024-01-20 14:30:00'),
(2, 2, 800.00, 50.00, 'paga', 'pix', 'Desconto por compra acima de R$ 700', '2024-01-22 16:45:00'),
(3, 2, 300.00, 0.00, 'entregue', 'cartao_debito', NULL, '2024-02-01 10:15:00'),
(4, 2, 650.00, 0.00, 'paga', 'cartao_credito', NULL, '2024-02-05 15:20:00'),
(5, 2, 380.00, 0.00, 'confirmada', 'boleto', 'Aguardando compensação', '2024-02-10 11:30:00'),
(6, 2, 520.00, 20.00, 'paga', 'dinheiro', 'Desconto à vista', '2024-02-12 13:45:00'),
(7, 2, 900.00, 0.00, 'pendente', 'cartao_credito', 'Aguardando confirmação do cartão', '2024-02-15 09:20:00'),
(8, 2, 280.00, 0.00, 'paga', 'pix', NULL, '2024-02-18 17:10:00');

INSERT INTO itens_venda (venda_id, produto_id, quantidade, preco_unitario, subtotal) VALUES
(1, 1, 1, 450.00, 450.00),
(2, 4, 1, 520.00, 520.00),
(2, 10, 1, 300.00, 300.00),
(3, 10, 1, 300.00, 300.00),
(4, 8, 1, 650.00, 650.00),
(5, 12, 1, 380.00, 380.00),
(6, 5, 1, 520.00, 520.00),
(7, 1, 1, 450.00, 450.00),
(7, 1, 1, 450.00, 450.00),
(8, 17, 1, 280.00, 280.00);

INSERT INTO carrinho (cliente_id, produto_id, quantidade) VALUES
(1, 6, 1),
(1, 13, 1),
(3, 11, 2),
(5, 15, 1),
(7, 9, 1);

INSERT INTO contas_pagar (fornecedor_id, descricao, valor, data_vencimento, status, categoria, observacoes) VALUES
(1, 'Compra de produtos Nike - Janeiro', 5600.00, '2024-02-15', 'paga', 'mercadoria', 'Pagamento realizado via transferência'),
(2, 'Compra de produtos Adidas - Janeiro', 3800.00, '2024-02-20', 'paga', 'mercadoria', NULL),
(3, 'Compra de produtos Puma - Fevereiro', 2400.00, '2024-03-10', 'pendente', 'mercadoria', 'Aguardando liberação financeira'),
(4, 'Compra de produtos New Balance', 1800.00, '2024-03-15', 'pendente', 'mercadoria', NULL),
(1, 'Aluguel loja - Março', 8500.00, '2024-03-10', 'pendente', 'aluguel', 'Valor mensal'),
(2, 'Conta de energia - Fevereiro', 450.00, '2024-03-05', 'vencida', 'energia', 'Vencimento perdido'),
(3, 'Conta de água - Fevereiro', 180.00, '2024-03-08', 'pendente', 'agua', NULL),
(1, 'Telefone/Internet - Março', 220.00, '2024-03-12', 'pendente', 'telefone', 'Plano empresarial');

INSERT INTO contas_receber (venda_id, cliente_id, descricao, valor, data_vencimento, status, forma_recebimento) VALUES
(5, 5, 'Venda boleto - Felipe Rodriguez', 380.00, '2024-02-25', 'pendente', 'boleto'),
(7, 7, 'Venda cartão crédito - Lucas Mendes', 900.00, '2024-03-01', 'pendente', 'cartao_credito'),
(NULL, 2, 'Venda parcelada - Ana Santos', 250.00, '2024-03-15', 'pendente', 'cartao_credito'),
(NULL, 2, 'Venda parcelada - Ana Santos', 250.00, '2024-04-15', 'pendente', 'cartao_credito'),
(NULL, 4, 'Venda parcelada - Mariana Costa', 325.00, '2024-03-20', 'pendente', 'cartao_credito'),
(NULL, 4, 'Venda parcelada - Mariana Costa', 325.00, '2024-04-20', 'pendente', 'cartao_credito'),
(1, 1, 'Venda à vista - Carlos Silva', 450.00, '2024-01-20', 'recebida', 'cartao_credito'),
(3, 3, 'Venda à vista - Pedro Oliveira', 300.00, '2024-02-01', 'recebida', 'cartao_debito');