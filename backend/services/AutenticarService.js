import bcrypt from "bcrypt";

export function criarAutenticarService({ clienteModel, administradorModel }) {
    async function login({ email, senha }) {
        if (!email || !senha) {
            throw new Error("Informe e-mail e senha");
        }

        const cliente = await clienteModel.buscarPorEmail(email);
        const administrador = await administradorModel.buscarPorEmail(email);

        const encontrados = [
            cliente && {
                id: cliente.id,
                nome: cliente.nome,
                email: cliente.email,
                senha: cliente.senha,
                tipo: "cliente"
            },
            administrador && {
                id: administrador.id,
                nome: administrador.nome,
                email: administrador.email,
                senha: administrador.senha,
                tipo: "administrador"
            }
        ].filter(Boolean);

        if (encontrados.length !== 1) {
            throw new Error("E-mail ou senha inválidos");
        }

        const usuario = encontrados[0];

        // Compara a senha digitada com o hash do banco.
        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            throw new Error("E-mail ou senha inválidos");
        }

        // Não devolve o hash da senha.
        const { senha: _, ...dadosUsuario } = usuario;

        return dadosUsuario;
    }

    return { login };
}