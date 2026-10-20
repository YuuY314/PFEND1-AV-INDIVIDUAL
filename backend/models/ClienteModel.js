export function criarClienteModel({ pool }){
    async function listarTodos(){
        const [linhas] = await pool.query("SELECT id, nome, email FROM clientes");
        return linhas;
    }

    async function buscarPorId(id){
        const [linhas] = await pool.query("SELECT id, nome, email FROM clientes WHERE id = ?", [id]);

        if(linhas.length === 0){
            return null;
        }

        return {...linhas[0]};
    }

    async function criar(cliente){
        const sql = "INSERT INTO clientes(nome, email, senha) VALUES(?, ?, ?)";

        const valores = [
            cliente.nome,
            cliente.email,
            cliente.senha
        ];

        const [resultado] = await pool.query(sql, valores);
        return {id: resultado.insertId, nome: cliente.nome, email: cliente.email};
    }

    async function deletarPorId(id) {
        const [resultado] = await pool.query("DELETE FROM clientes WHERE id = ?", [id]);

        if (resultado.affectedRows === 0) {
            return null;
        }

        return true;
    }

    async function atualizar(id, cliente) {
        const sql = "UPDATE clientes SET nome = ?, email = ?, senha = ? WHERE id = ?";

        const valores = [
            cliente.nome,
            cliente.email,
            cliente.senha,
            id
        ];

        const [resultado] = await pool.query(sql, valores);

        if (resultado.affectedRows === 0) {
            const existente = await buscarPorId(id);

            if (!existente) {
                return null;
            }
        }

        return {id: Number(id), nome: cliente.nome, email: cliente.email};
    }

    return { listarTodos, buscarPorId, criar, deletarPorId, atualizar };
}