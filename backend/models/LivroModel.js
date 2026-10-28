export function criarLivroModel({ pool }){
    async function listarTodos(){
        const [linhas] = await pool.query("SELECT * FROM livros");
        return linhas.map(l => ({...l, preco: Number(l.preco)}));
    }

    async function buscarPorId(id){
        const [linhas] = await pool.query("SELECT * FROM livros WHERE id = ?", [id]);

        if(linhas.length === 0){
            return null;
        }

        return {...linhas[0], preco: Number(linhas[0].preco)};
    }

    async function criar(livro){
        const sql = "INSERT INTO livros(titulo, autor, categoria, preco, estoque, descricao, imagem_url) VALUES(?, ?, ?, ?, ?, ?, ?)";

        const valores = [
            livro.titulo,
            livro.autor,
            livro.categoria,
            livro.preco,
            livro.estoque,
            livro.descricao,
            livro.imagem_url
        ];

        const [resultado] = await pool.query(sql, valores);
        return {...livro, id: resultado.insertId};
    }

    async function deletarPorId(id) {
        const [resultado] = await pool.query("DELETE FROM livros WHERE id = ?", [id]);

        if (resultado.affectedRows === 0) {
            return null;
        }

        return true;
    }

    async function atualizar(id, livro) {
        const sql = "UPDATE livros SET titulo = ?, autor = ?, categoria = ?, preco = ?, estoque = ?, descricao = ?, imagem_url = ? WHERE id = ?";

        const valores = [
            livro.titulo,
            livro.autor,
            livro.categoria,
            livro.preco,
            livro.estoque,
            livro.descricao,
            livro.imagem_url,
            id
        ];

        const [resultado] = await pool.query(sql, valores);

        if (resultado.affectedRows === 0) {
            const existente = await buscarPorId(id);

            if (!existente) {
                return null;
            }
        }

        return {...livro, id: Number(id), preco: Number(livro.preco)};
    }

    // Subtrai do estoque só se ainda houver unidades suficientes (a checagem é feita no próprio UPDATE, assim dois clientes comprando ao mesmo tempo não deixam o estoque negativo)
    async function reduzirEstoque(id, quantidade) {
        const sql = "UPDATE livros SET estoque = estoque - ? WHERE id = ? AND estoque >= ?";

        const [resultado] = await pool.query(sql, [quantidade, id, quantidade]);

        if (resultado.affectedRows === 0) {
            return null;
        }

        return buscarPorId(id);
    }

    return { listarTodos, buscarPorId, criar, deletarPorId, atualizar, reduzirEstoque };
}