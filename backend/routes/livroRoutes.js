import express from "express";

export function criarLivroRoutes({ livroController }){
    const router = express.Router();

    router.get("/", livroController.listar);
    router.get("/:id", livroController.buscar);
    router.post("/", livroController.criar);
    router.delete("/:id", livroController.deletar);
    router.put("/:id", livroController.atualizar);
    router.patch("/:id/estoque", livroController.reduzirEstoque);

    return router;
}