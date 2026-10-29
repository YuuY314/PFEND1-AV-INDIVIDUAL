-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3309
-- Tempo de geração: 29/10/2026 às 02:20
-- Versão do servidor: 26.7.0
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `entrelinhas`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `administradores`
--

CREATE TABLE `administradores` (
  `id` int NOT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `senha` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `administradores`
--

INSERT INTO `administradores` (`id`, `nome`, `email`, `senha`) VALUES
(2, 'Rafael', 'rafa@admin.com', '$2b$10$N9FVO6BoWtGprl6x9o.5medl7pOpHrz0NUtQS4vXtHtGLC/x6HV5m'),
(3, 'Rafael Yu', 'rafa2@admin.com', '$2b$10$tAY2acejtxL983V8IJsPLebKk.O3FIHT01kmG9Gsdt0KfAcAysyzS');

-- --------------------------------------------------------

--
-- Estrutura para tabela `clientes`
--

CREATE TABLE `clientes` (
  `id` int NOT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `senha` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `clientes`
--

INSERT INTO `clientes` (`id`, `nome`, `email`, `senha`) VALUES
(1, 'Rafael', 'rafa@email.com', '$2b$10$V211JMsQ69vOVC1Ku2uNMOeiisF5YtS/RMOg.XqI3/VYxir7YegBC');

-- --------------------------------------------------------

--
-- Estrutura para tabela `livros`
--

CREATE TABLE `livros` (
  `id` int NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `autor` varchar(100) NOT NULL,
  `categoria` varchar(50) NOT NULL,
  `preco` decimal(10,2) NOT NULL,
  `estoque` int NOT NULL DEFAULT '0',
  `descricao` text,
  `imagem_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `livros`
--

INSERT INTO `livros` (`id`, `titulo`, `autor`, `categoria`, `preco`, `estoque`, `descricao`, `imagem_url`) VALUES
(1, 'O Hobbit', 'J.R.R. Tolkien', 'Fantasia', 49.90, 0, 'A aventura de Bilbo Bolseiro em uma jornada inesperada pela Terra-média.', 'https://placehold.co/300x450?text=O+Hobbit'),
(2, 'O Senhor dos Anéis: A Sociedade do Anel', 'J.R.R. Tolkien', 'Fantasia', 69.90, 12, 'O início da jornada para destruir o Um Anel e impedir o retorno de Sauron.', 'https://placehold.co/300x450?text=Sociedade+do+Anel'),
(3, 'Harry Potter e a Pedra Filosofal', 'J.K. Rowling', 'Fantasia', 44.90, 20, 'Harry descobre sua origem mágica e inicia seus estudos em Hogwarts.', 'https://placehold.co/300x450?text=Harry+Potter'),
(4, 'A Guerra dos Tronos', 'George R.R. Martin', 'Fantasia', 59.90, 10, 'Famílias nobres disputam o poder em um reino marcado por intrigas e guerras.', 'https://placehold.co/300x450?text=A+Guerra+dos+Tronos'),
(5, 'Duna', 'Frank Herbert', 'Ficção Científica', 64.90, 8, 'Paul Atreides enfrenta conflitos políticos e profecias no planeta desértico Arrakis.', 'https://placehold.co/300x450?text=Duna'),
(6, '1984', 'George Orwell', 'Distopia', 34.90, 18, 'Um homem vive sob a vigilância constante de um regime totalitário.', 'https://placehold.co/300x450?text=1984'),
(7, 'Admirável Mundo Novo', 'Aldous Huxley', 'Distopia', 39.90, 11, 'Uma sociedade futurista questiona a liberdade, o condicionamento e a felicidade.', 'https://placehold.co/300x450?text=Admiravel+Mundo+Novo'),
(8, 'Dom Casmurro', 'Machado de Assis', 'Literatura Brasileira', 24.90, 25, 'Bentinho narra sua história e levanta dúvidas sobre seu relacionamento com Capitu.', 'https://placehold.co/300x450?text=Dom+Casmurro'),
(9, 'Memórias Póstumas de Brás Cubas', 'Machado de Assis', 'Literatura Brasileira', 29.90, 14, 'Um narrador defunto revisita sua vida com ironia e crítica à sociedade.', 'https://placehold.co/300x450?text=Braz+Cubas'),
(10, 'O Cortiço', 'Aluísio Azevedo', 'Literatura Brasileira', 27.90, 16, 'Um romance naturalista sobre desigualdade e relações sociais em uma habitação coletiva.', 'https://placehold.co/300x450?text=O+Cortico'),
(11, 'Crime e Castigo', 'Fiódor Dostoiévski', 'Romance', 54.90, 9, 'Um jovem estudante enfrenta as consequências psicológicas e morais de um crime.', 'https://placehold.co/300x450?text=Crime+e+Castigo'),
(12, 'Orgulho e Preconceito', 'Jane Austen', 'Romance', 32.90, 17, 'Elizabeth Bennet e Mr. Darcy enfrentam preconceitos e expectativas sociais.', 'https://placehold.co/300x450?text=Orgulho+e+Preconceito'),
(13, 'O Pequeno Príncipe', 'Antoine de Saint-Exupéry', 'Literatura Infantojuvenil', 29.90, 22, 'Um piloto conhece um pequeno príncipe que compartilha suas experiências e reflexões.', 'https://placehold.co/300x450?text=O+Pequeno+Principe'),
(14, 'Percy Jackson e o Ladrão de Raios', 'Rick Riordan', 'Fantasia', 42.90, 13, 'Percy descobre sua ligação com a mitologia grega e parte em uma missão perigosa.', 'https://placehold.co/300x450?text=Percy+Jackson'),
(15, 'O Código Da Vinci', 'Dan Brown', 'Suspense', 47.90, 7, 'Um simbologista investiga pistas e segredos ligados a uma antiga conspiração.', 'https://placehold.co/300x450?text=Codigo+Da+Vinci'),
(16, 'Sapiens: Uma Breve História da Humanidade', 'Yuval Noah Harari', 'História', 59.90, 10, 'Uma análise da evolução humana e das transformações das sociedades ao longo do tempo.', 'https://placehold.co/300x450?text=Sapiens'),
(17, 'O Poder do Hábito', 'Charles Duhigg', 'Desenvolvimento Pessoal', 44.90, 12, 'Uma exploração de como os hábitos funcionam e como podem ser transformados.', 'https://placehold.co/300x450?text=O+Poder+do+Habito'),
(18, 'Clean Code', 'Robert C. Martin', 'Tecnologia', 89.90, 6, 'Princípios e práticas para escrever código mais legível, organizado e sustentável.', 'https://placehold.co/300x450?text=Clean+Code'),
(19, 'Entendendo Algoritmos', 'Aditya Y. Bhargava', 'Tecnologia', 74.90, 9, 'Uma introdução visual aos principais algoritmos e conceitos fundamentais da computação.', 'https://placehold.co/300x450?text=Entendendo+Algoritmos'),
(20, 'O Nome do Vento', 'Patrick Rothfuss', 'Fantasia', 64.90, 5, 'Kvothe conta sua trajetória, desde a infância até sua formação como músico e arcanista.', 'https://placehold.co/300x450?text=O+Nome+do+Vento'),
(21, 'O Cavaleiro Morto-Vivo', 'Rafael Yu', 'Fantasia', 39.90, 50, 'Ash passou boa parte de sua juventude viajando ao lado de seu mestre, um cavaleiro errante que percorre as estradas em busca de trabalho, fortuna e novas histórias para contar. Entre caçadas, missões e noites ao redor da fogueira, a vida dos dois sempre pareceu simples, apesar dos perigos que encontravam pelo caminho. Até que uma estranha doença começa a transformar os mortos em criaturas sedentas por sangue.\n\nQuando uma noite comum na floresta se transforma em um pesadelo, Ash se vê diante de algo que jamais poderia imaginar. Enquanto a praga se espalha e os mortos caminham novamente, ele precisará acompanhar seu mestre por um mundo cada vez mais perigoso — e descobrir por que algumas pessoas parecem resistir àquilo que condena tantas outras.\n\nEntre cavaleiros, monstros e segredos enterrados há muito tempo, Ash descobrirá que nem todos os mortos permanecem mortos. E que talvez o maior perigo não esteja entre eles.', 'https://placehold.co/300x450?text=O+Cavaleiro+Morto-Vivo');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `administradores`
--
ALTER TABLE `administradores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Índices de tabela `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Índices de tabela `livros`
--
ALTER TABLE `livros`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `administradores`
--
ALTER TABLE `administradores`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `livros`
--
ALTER TABLE `livros`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
