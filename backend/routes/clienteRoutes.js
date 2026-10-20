import express from "express";

export function criarClienteRoutes({ clienteController }){
    const router = express.Router();

    router.get("/", clienteController.listar);
    router.get("/:id", clienteController.buscar);
    router.post("/", clienteController.criar);
    router.delete("/:id", clienteController.deletar);
    router.put("/:id", clienteController.atualizar);

    return router;
}