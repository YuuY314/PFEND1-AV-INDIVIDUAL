export default class Cliente {
    constructor({ id, nome, email, senha }) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new TypeError("O número deve ser inteiro e positivo");
        }

        if (typeof nome !== "string" || nome.trim() === "") {
            throw new TypeError("Nome é obrigatório");
        }

        if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new TypeError("E-mail deve ser válido");
        }

        if (typeof senha !== "string" || senha.trim() === "") {
            throw new TypeError("Senha é obrigatória");
        }

        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
    }
}