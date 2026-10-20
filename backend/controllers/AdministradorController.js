export function criarAdministradorController({ administradorService }) {
    async function listar(req, res, next) {
        try {
            const administradores = await administradorService.listar();
            res.status(200).json({ sucesso: true, dados: administradores });
        } catch (erro) {
            next(erro);
        }
    }

    async function buscar(req, res, next) {
        try {
            const administrador = await administradorService.buscarPorId(req.params.id);
            res.status(200).json({ sucesso: true, dados: administrador });
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
            await administradorService.deletarPorId(req.params.id);
            res.status(200).json({
                sucesso: true,
                mensagem: "Administrador excluído com sucesso"
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
            const administradorAtualizado = await administradorService.atualizar(
                req.params.id,
                req.body
            );

            res.status(200).json({
                sucesso: true,
                mensagem: "Administrador atualizado com sucesso",
                dados: administradorAtualizado
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
            const administradorNovo = await administradorService.criar(req.body);
            res.status(201).json({ sucesso: true, dados: administradorNovo });
        } catch (erro) {
            res.status(400).json({ sucesso: false, erro: erro.message });
        }
    }

    return { listar, buscar, criar, deletar, atualizar };
}