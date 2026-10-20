export function criarClienteController({ clienteService }) {
    async function listar(req, res, next) {
        try {
            const clientes = await clienteService.listar();
            res.status(200).json({ sucesso: true, dados: clientes });
        } catch (erro) {
            next(erro);
        }
    }

    async function buscar(req, res, next) {
        try {
            const cliente = await clienteService.buscarPorId(req.params.id);
            res.status(200).json({ sucesso: true, dados: cliente });
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
            await clienteService.deletarPorId(req.params.id);
            res.status(200).json({
                sucesso: true,
                mensagem: "Cliente excluído com sucesso"
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
            const clienteAtualizado = await clienteService.atualizar(
                req.params.id,
                req.body
            );

            res.status(200).json({
                sucesso: true,
                mensagem: "Cliente atualizado com sucesso",
                dados: clienteAtualizado
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
            const clienteNovo = await clienteService.criar(req.body);
            res.status(201).json({ sucesso: true, dados: clienteNovo });
        } catch (erro) {
            res.status(400).json({ sucesso: false, erro: erro.message });
        }
    }

    return { listar, buscar, criar, deletar, atualizar };
}