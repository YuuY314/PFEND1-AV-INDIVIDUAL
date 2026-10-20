import Cliente from "../models/Cliente.js";
import bcrypt from "bcrypt";

export function criarClienteService({ clienteModel }) {
    async function listar() {
        return clienteModel.listarTodos();
    }

    async function buscarPorId(idRecebido) {
        const id = Number(idRecebido);

        if (!Number.isInteger(id) || id <= 0) {
            throw new Error("ID deve ser um número inteiro positivo");
        }

        const cliente = await clienteModel.buscarPorId(id);

        if (!cliente) {
            throw new Error(`Cliente ${id} não encontrado`);
        }

        return cliente;
    }

    async function deletarPorId(idRecebido) {
        const id = Number(idRecebido);

        if (!Number.isInteger(id) || id <= 0) {
            throw new Error("ID deve ser um número inteiro positivo");
        }

        const deletado = await clienteModel.deletarPorId(id);

        if (!deletado) {
            throw new Error(`Cliente ${id} não encontrado`);
        }

        return true;
    }

    async function criar(dados) {
        const cliente = new Cliente({ id: 1, ...dados });
        const senhaHash = await bcrypt.hash(cliente.senha, 10);

        return clienteModel.criar({
            nome: cliente.nome,
            email: cliente.email,
            senha: senhaHash
        });
    }

    async function atualizar(idRecebido, dados) {
        const id = Number(idRecebido);

        if (!Number.isInteger(id) || id <= 0) {
            throw new Error("ID deve ser um número inteiro positivo");
        }

        const clienteExistente = await clienteModel.buscarPorId(id);

        if (!clienteExistente) {
            throw new Error(`Cliente ${id} não encontrado`);
        }

        const cliente = new Cliente({ id, ...dados });
        const senhaHash = await bcrypt.hash(cliente.senha, 10);

        return clienteModel.atualizar(id, {
            nome: cliente.nome,
            email: cliente.email,
            senha: senhaHash
        });
    }

    return { listar, buscarPorId, criar, deletarPorId, atualizar };
}