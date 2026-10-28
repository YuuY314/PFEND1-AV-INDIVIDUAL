export function criarLivroController({ livroService }) {
    async function listar(req, res, next) {
        try {
            const livros = await livroService.listar();
            res.status(200).json({ sucesso: true, dados: livros });
        } catch (erro) {
            next(erro);
        }
    }

    async function buscar(req, res, next) {
        try {
            const livro = await livroService.buscarPorId(req.params.id);
            res.status(200).json({ sucesso: true, dados: livro });
        } catch (erro) {
            if (erro instanceof TypeError) {
                return res.status(400).json({ erro: erro.message });
            }

            if (erro.message.includes("ID deve")) {
                return res.status(400).json({ erro: erro.message });
            }

            if (erro.message.includes("não encontrado")) {
                return res.status(404).json({ erro: erro.message });
            }

            next(erro);
        }
    }

    async function deletar(req, res, next) {
        try {
            await livroService.deletarPorId(req.params.id);
            res.status(200).json({
                sucesso: true,
                mensagem: "Livro excluído com sucesso"
            });
        } catch (erro) {
            if (erro.message.includes("ID deve")) {
                return res.status(400).json({ erro: erro.message });
            }

            if (erro.message.includes("não encontrado")) {
                return res.status(404).json({ erro: erro.message });
            }

            next(erro);
        }
    }

    async function atualizar(req, res, next) {
        try {
            const livroAtualizado = await livroService.atualizar(
                req.params.id,
                req.body
            );

            res.status(200).json({
                sucesso: true,
                mensagem: "Livro atualizado com sucesso",
                dados: livroAtualizado
            });
        } catch (erro) {
            if (erro.message.includes("ID deve")) {
                return res.status(400).json({ erro: erro.message });
            }

            if (erro.message.includes("não encontrado")) {
                return res.status(404).json({ erro: erro.message });
            }

            if (erro instanceof TypeError || erro instanceof Error) {
                return res.status(400).json({
                    sucesso: false,
                    erro: erro.message
                });
            }

            next(erro);
        }
    }

    async function criar(req, res, next) {
        try {
            const livroNovo = await livroService.criar(req.body);
            res.status(201).json({ sucesso: true, dados: livroNovo });
        } catch (erro) {
            res.status(400).json({ sucesso: false, erro: erro.message });
        }
    }

    async function reduzirEstoque(req, res, next) {
        try {
            const usuario = req.session.usuario;

            if (!usuario) {
                return res.status(401).json({
                    sucesso: false,
                    erro: "Faça login para comprar"
                });
            }

            if (usuario.tipo !== "cliente") {
                return res.status(403).json({
                    sucesso: false,
                    erro: "Apenas clientes podem comprar"
                });
            }

            const livro = await livroService.reduzirEstoque(
                req.params.id,
                req.body?.quantidade
            );

            res.status(200).json({
                sucesso: true,
                mensagem: "Compra realizada! Estoque atualizado",
                dados: livro
            });
        } catch (erro) {
            if (erro.message.includes("ID deve") || erro.message.includes("Quantidade deve")) {
                return res.status(400).json({ sucesso: false, erro: erro.message });
            }

            if (erro.message.includes("não encontrado")) {
                return res.status(404).json({ sucesso: false, erro: erro.message });
            }

            if (erro.message.includes("Estoque insuficiente")) {
                return res.status(409).json({ sucesso: false, erro: erro.message });
            }

            next(erro);
        }
    }

    return { listar, buscar, criar, deletar, atualizar, reduzirEstoque };
}