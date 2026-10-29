export function criarAdministradorModel({ pool }){
    async function listarTodos(){
        const [linhas] = await pool.query("SELECT id, nome, email FROM administradores");
        return linhas;
    }

    async function buscarPorId(id){
        const [linhas] = await pool.query("SELECT id, nome, email FROM administradores WHERE id = ?", [id]);

        if(linhas.length === 0){
            return null;
        }

        return {...linhas[0]};
    }

    // Usado só pelo login: é o único lugar que precisa da coluna senha (hash)
    async function buscarPorEmail(email){
        const [linhas] = await pool.query("SELECT id, nome, email, senha FROM administradores WHERE email = ?", [email]);

        if(linhas.length === 0){
            return null;
        }

        return {...linhas[0]};
    }

    async function criar(administrador){
        const sql = "INSERT INTO administradores(nome, email, senha) VALUES(?, ?, ?)";

        const valores = [
            administrador.nome,
            administrador.email,
            administrador.senha
        ];

        const [resultado] = await pool.query(sql, valores);
        return {id: resultado.insertId, nome: administrador.nome, email: administrador.email};
    }

    async function deletarPorId(id) {
        const [resultado] = await pool.query("DELETE FROM administradores WHERE id = ?", [id]);

        if (resultado.affectedRows === 0) {
            return null;
        }

        return true;
    }

    async function atualizar(id, administrador) {
        const sql = "UPDATE administradores SET nome = ?, email = ?, senha = ? WHERE id = ?";

        const valores = [
            administrador.nome,
            administrador.email,
            administrador.senha,
            id
        ];

        const [resultado] = await pool.query(sql, valores);

        if (resultado.affectedRows === 0) {
            const existente = await buscarPorId(id);

            if (!existente) {
                return null;
            }
        }

        return {
            id: Number(id),
            nome: administrador.nome,
            email: administrador.email
        };
    }

    return { listarTodos, buscarPorId, buscarPorEmail, criar, deletarPorId, atualizar };
}