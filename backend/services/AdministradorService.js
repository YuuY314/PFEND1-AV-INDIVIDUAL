import Administrador from "../models/Administrador.js";
import bcrypt from "bcrypt";

export function criarAdministradorService({ administradorModel }) {
    async function listar() {
        return administradorModel.listarTodos();
    }

    async function buscarPorId(idRecebido) {
        const id = Number(idRecebido);

        if (!Number.isInteger(id) || id <= 0) {
            throw new Error("ID deve ser um número inteiro positivo");
        }

        const administrador = await administradorModel.buscarPorId(id);

        if (!administrador) {
            throw new Error(`Administrador ${id} não encontrado`);
        }

        return administrador;
    }

    async function deletarPorId(idRecebido) {
        const id = Number(idRecebido);

        if (!Number.isInteger(id) || id <= 0) {
            throw new Error("ID deve ser um número inteiro positivo");
        }

        const deletado = await administradorModel.deletarPorId(id);

        if (!deletado) {
            throw new Error(`Administrador ${id} não encontrado`);
        }

        return true;
    }

    async function criar(dados) {
        const administrador = new Administrador({ id: 1, ...dados });
        const senhaHash = await bcrypt.hash(administrador.senha, 10);

        return administradorModel.criar({
            nome: administrador.nome,
            email: administrador.email,
            senha: senhaHash
        });
    }

    async function atualizar(idRecebido, dados) {
        const id = Number(idRecebido);

        if (!Number.isInteger(id) || id <= 0) {
            throw new Error("ID deve ser um número inteiro positivo");
        }

        const administradorExistente = await administradorModel.buscarPorId(id);

        if (!administradorExistente) {
            throw new Error(`Administrador ${id} não encontrado`);
        }

        const administrador = new Administrador({ id, ...dados });
        const senhaHash = await bcrypt.hash(administrador.senha, 10);

        return administradorModel.atualizar(id, {
            nome: administrador.nome,
            email: administrador.email,
            senha: senhaHash
        });
    }

    return { listar, buscarPorId, criar, deletarPorId, atualizar };
}