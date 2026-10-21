export function criarAutenticarController({ autenticarService }) {
    async function login(req, res, next) {
        try {
            const usuario = await autenticarService.login(req.body);

            req.session.regenerate((erro) => {
                if (erro) return next(erro);

                req.session.usuario = usuario;

                req.session.save((erro) => {
                    if (erro) return next(erro);

                    res.status(200).json({
                        sucesso: true,
                        mensagem: "Login realizado com sucesso",
                        dados: usuario
                    });
                });
            });
        } catch (erro) {
            if (erro.message.includes("inválidos")) {
                return res.status(401).json({
                    sucesso: false,
                    erro: erro.message
                });
            }

            next(erro);
        }
    }

    function me(req, res) {
        if (!req.session.usuario) {
            return res.status(401).json({
                sucesso: false,
                autenticado: false
            });
        }

        res.status(200).json({
            sucesso: true,
            autenticado: true,
            dados: req.session.usuario
        });
    }

    function logout(req, res, next) {
        req.session.destroy((erro) => {
            if (erro) return next(erro);

            res.clearCookie("connect.sid");
            res.status(200).json({
                sucesso: true,
                mensagem: "Logout realizado com sucesso"
            });
        });
    }

    return { login, me, logout };
}