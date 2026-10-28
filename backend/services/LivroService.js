import Livro from "../models/Livro.js";

export function criarLivroService({ livroModel }) {
    async function listar() {
        return livroModel.listarTodos();
    }

    async function buscarPorId(idRecebido) {
        const id = Number(idRecebido);

        if (!Number.isInteger(id) || id <= 0) {
            throw new Error("ID deve ser um número inteiro positivo");
        }

        const livro = await livroModel.buscarPorId(id);

        if (!livro) {
            throw new Error(`Livro ${id} não encontrado`);
        }

        return livro;
    }

    async function deletarPorId(idRecebido) {
        const id = Number(idRecebido);

        if (!Number.isInteger(id) || id <= 0) {
            throw new Error("ID deve ser um número inteiro positivo");
        }

        const deletado = await livroModel.deletarPorId(id);

        if (!deletado) {
            throw new Error(`Livro ${id} não encontrado`);
        }

        return true;
    }

    async function criar(dados) {
        const livro = new Livro({ id: 1, ...dados });

        return livroModel.criar({
            titulo: livro.titulo,
            autor: livro.autor,
            categoria: livro.categoria,
            preco: livro.preco,
            estoque: livro.estoque,
            descricao: livro.descricao,
            imagem_url: livro.imagem_url
        });
    }

    async function atualizar(idRecebido, dados) {
        const id = Number(idRecebido);

        if (!Number.isInteger(id) || id <= 0) {
            throw new Error("ID deve ser um número inteiro positivo");
        }

        const livroExistente = await livroModel.buscarPorId(id);

        if (!livroExistente) {
            throw new Error(`Livro ${id} não encontrado`);
        }

        const livro = new Livro({ id, ...dados });

        return livroModel.atualizar(id, {
            titulo: livro.titulo,
            autor: livro.autor,
            categoria: livro.categoria,
            preco: livro.preco,
            estoque: livro.estoque,
            descricao: livro.descricao,
            imagem_url: livro.imagem_url
        });
    }

    async function reduzirEstoque(idRecebido, quantidadeRecebida = 1) {
        const id = Number(idRecebido);

        if (!Number.isInteger(id) || id <= 0) {
            throw new Error("ID deve ser um número inteiro positivo");
        }

        const quantidade = Number(quantidadeRecebida);

        if (!Number.isInteger(quantidade) || quantidade <= 0) {
            throw new Error("Quantidade deve ser um número inteiro positivo");
        }

        const livroAtualizado = await livroModel.reduzirEstoque(id, quantidade);

        if (livroAtualizado) {
            return livroAtualizado;
        }

        // Não atualizou: ou o livro não existe, ou não há estoque suficiente
        const livro = await livroModel.buscarPorId(id);

        if (!livro) {
            throw new Error(`Livro ${id} não encontrado`);
        }

        throw new Error(`Estoque insuficiente: restam ${livro.estoque} unidade(s)`);
    }

    return { listar, buscarPorId, criar, deletarPorId, atualizar, reduzirEstoque };
}