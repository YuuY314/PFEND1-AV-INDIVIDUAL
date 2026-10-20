import express from "express";

export function criarAdministradorRoutes({ administradorController }){
    const router = express.Router();

    router.get("/", administradorController.listar);
    router.get("/:id", administradorController.buscar);
    router.post("/", administradorController.criar);
    router.delete("/:id", administradorController.deletar);
    router.put("/:id", administradorController.atualizar);

    return router;
}