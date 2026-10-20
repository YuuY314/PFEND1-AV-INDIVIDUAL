export default class Livro {
    constructor({ id, titulo, autor, categoria, preco, estoque, descricao, imagem_url }) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new TypeError("O número deve ser inteiro e positivo");
        }

        if (typeof titulo !== "string" || titulo.trim() === "") {
            throw new TypeError("Título é obrigatório");
        }

        if (typeof autor !== "string" || autor.trim() === "") {
            throw new TypeError("Autor é obrigatório");
        }

        if (typeof categoria !== "string" || categoria.trim() === "") {
            throw new TypeError("Categoria é obrigatória");
        }

        if (typeof preco !== "number" || !Number.isFinite(preco) || preco < 0) {
            throw new TypeError("Preço deve ser um número válido e não negativo");
        }

        if (!Number.isInteger(estoque) || estoque < 0) {
            throw new TypeError("Estoque deve ser um inteiro não negativo");
        }

        if (descricao !== undefined && typeof descricao !== "string") {
            throw new TypeError("Descrição deve ser um texto");
        }

        if (imagem_url !== undefined && typeof imagem_url !== "string") {
            throw new TypeError("URL da imagem deve ser um texto");
        }

        this.id = id;
        this.titulo = titulo;
        this.autor = autor;
        this.categoria = categoria;
        this.preco = preco;
        this.estoque = estoque;
        this.descricao = descricao ?? "";
        this.imagem_url = imagem_url ?? "";
    }

    calcularValorEmEstoque() {
        return this.preco * this.estoque;
    }

    calcularPrecoComDesconto(percentual) {
        if (typeof percentual !== "number" || percentual < 0 || percentual > 100) {
            throw new TypeError("O desconto deve estar entre 0 e 100");
        }

        return this.preco * (1 - percentual / 100);
    }
}