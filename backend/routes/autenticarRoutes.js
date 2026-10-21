import express from "express";

export function criarAutenticarRoutes({ autenticarController }) {
    const router = express.Router();

    router.post("/login", autenticarController.login);
    router.get("/me", autenticarController.me);
    router.post("/logout", autenticarController.logout);

    return router;
}