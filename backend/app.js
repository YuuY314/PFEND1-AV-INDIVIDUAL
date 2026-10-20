import express from "express";
import cors from "cors";
import session from "express-session";
import { criarPool } from "./config/database.js";

// Models
import { criarLivroModel } from "./models/LivroModel.js";
import { criarClienteModel } from "./models/ClienteModel.js";
import { criarAdministradorModel } from "./models/AdministradorModel.js";

// Services
import { criarLivroService } from "./services/LivroService.js";
import { criarClienteService } from "./services/ClienteService.js";
import { criarAdministradorService } from "./services/AdministradorService.js";

// Controllers
import { criarLivroController } from "./controllers/LivroController.js";
import { criarClienteController } from "./controllers/ClienteController.js";
import { criarAdministradorController } from "./controllers/AdministradorController.js";

// Routes
import { criarLivroRoutes } from "./routes/livroRoutes.js";
import { criarClienteRoutes } from "./routes/clienteRoutes.js";
import { criarAdministradorRoutes } from "./routes/administradorRoutes.js";

export const app = express();

// CORS necessário pelo frontend e backend usarem portas diferentes
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

// Middleware para ler JSON no corpo da requisição
app.use(express.json());

// Habilitar sessão
app.use(session({
    secret: process.env.SESSION_SECRET || "segredo-desenvolvimento",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Conexão com o banco de dados
const pool = criarPool();

// ==================== LIVRO ====================
const livroModel = criarLivroModel({ pool });
const livroService = criarLivroService({ livroModel });
const livroController = criarLivroController({ livroService });
const livroRoutes = criarLivroRoutes({ livroController });

// ==================== CLIENTE ====================
const clienteModel = criarClienteModel({ pool });
const clienteService = criarClienteService({ clienteModel });
const clienteController = criarClienteController({ clienteService });
const clienteRoutes = criarClienteRoutes({ clienteController });

// ==================== ADMINISTRADOR ====================
const administradorModel = criarAdministradorModel({ pool });
const administradorService = criarAdministradorService({ administradorModel });
const administradorController = criarAdministradorController({ administradorService });
const administradorRoutes = criarAdministradorRoutes({ administradorController });

// Rota de teste do servidor
app.get("/api/check", (req, res) => {
    res.status(200).json({
        status: "ok",
        mensagem: "Servidor funcionando via HTTP"
    });
});

// Registro das rotas
app.use("/api/livro", livroRoutes);
app.use("/api/cliente", clienteRoutes);
app.use("/api/administrador", administradorRoutes);

// Rota para caminhos inexistentes
app.use((req, res) => {
    res.status(404).json({
        erro: `A rota ${req.method} ${req.originalUrl} não existe.`
    });
});

// Tratamento de erros
app.use((erro, req, res, _next) => {
    console.error(`Erro de sistema: ${erro.message}`);

    res.status(500).json({
        erro: "Falha interna do servidor"
    });
});