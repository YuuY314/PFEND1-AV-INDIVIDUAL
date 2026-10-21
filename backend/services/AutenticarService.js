import bcrypt from "bcrypt";

export function criarAutenticarService({ clienteModel, administradorModel }) {
    async function login({ email, senha }) {
        if (!email || !senha) {
            throw new Error("Informe e-mail e senha");
        }

        const clientes = await clienteModel.listarTodos();
        const administradores = await administradorModel.listarTodos();

        const encontrados = [
            ...clientes
                .filter(u => u.email === email)
                .map(u => ({
                    id: u.id,
                    nome: u.nome,
                    email: u.email,
                    senha: u.senha,
                    tipo: "cliente"
                })),
            ...administradores
                .filter(u => u.email === email)
                .map(u => ({
                    id: u.id,
                    nome: u.nome,
                    email: u.email,
                    senha: u.senha,
                    tipo: "administrador"
                }))
        ];

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