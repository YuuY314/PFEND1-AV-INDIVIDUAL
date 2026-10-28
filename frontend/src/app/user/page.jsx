"use client";

import styles from "./user.module.css";

import { useEffect, useState } from "react";
import Link from "next/link";

import BookCard from "@/components/BookCard";
import RedirectButton from "@/components/RedirectButton";
import { formatarMoeda } from "@/utils/formatarMoeda.js";

const atalhos = [
    { titulo: "Meus pedidos", texto: "Acompanhe suas compras.", icone: "/bag.png", href: "#pedidos" },
    { titulo: "Favoritos", texto: "Os livros que você quer ler.", icone: "/heart.png", href: "/favorites" },
    { titulo: "Ofertas", texto: "Promoções para presentear.", icone: "/gift.png", href: "/shelf" },
    { titulo: "Meus dados", texto: "Confira as informações da conta.", icone: "/user.png", href: "#dados" },
];

// TODO: trocar por dados da API quando a rota de pedidos existir (tabela "pedidos" já está na migration)
const pedidosExemplo = [
    { id: 1024, data: "21/10/2026", status: "Enviado", total: 89.8 },
    { id: 1017, data: "02/10/2026", status: "Entregue", total: 45.9 },
    { id: 1009, data: "18/09/2026", status: "Cancelado", total: 32 },
];

// Cada status do ENUM de pedidos recebe uma cor de badge do Bootstrap
const corDoStatus = {
    Pendente: "warning",
    Confirmado: "info",
    Enviado: "primary",
    Entregue: "success",
    Cancelado: "danger",
};

export default function User(){
    const [ usuario, setUsuario ] = useState(null);
    const [ carregando, setCarregando ] = useState(true);

    const [ livros, setLivros ] = useState([]);
    const [ carregandoLivros, setCarregandoLivros ] = useState(true);
    const [ erroLivros, setErroLivros ] = useState("");

    // Rota protegida: confere a sessão no backend; quem não está logado volta para o login
    useEffect(() => {
        fetch("http://localhost:3001/api/autenticar/me", { credentials: "include" })
            .then(res => res.json())
            .then(data => {
                if (!data.autenticado) {
                    window.location.href = "/login";
                } else if (data.dados.tipo !== "cliente") {
                    window.location.href = "/";
                } else {
                    setUsuario(data.dados);
                }
            })
            .catch(() => { window.location.href = "/login"; })
            .finally(() => setCarregando(false));
    }, []);

    useEffect(() => {
        if (!usuario) return;

        fetch("http://localhost:3001/api/livro")
            .then((res) => {
                if (!res.ok) throw new Error("Não foi possível carregar as sugestões.");
                return res.json();
            })
            .then((data) => setLivros((data.dados ?? []).slice(0, 6)))
            .catch((error) => setErroLivros(error.message))
            .finally(() => setCarregandoLivros(false));
    }, [usuario]);

    if (carregando || !usuario) {
        return (
            <main className="d-flex align-items-center justify-content-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
            </main>
        );
    }

    const primeiroNome = usuario.nome?.trim().split(" ")[0] || "leitor";

    return (
        <main>
            {/* ===== Boas-vindas ===== */}
            <section className={`d-flex flex-column align-items-start gap-3 p-5 ${styles.user_banner}`}>
                <p className={styles.alt_color}>ÁREA DO LEITOR</p>
                <h1>Olá, {primeiroNome}!</h1>
                <p>Que bom ter você de volta. Veja seus pedidos, descubra novas leituras e cuide da sua conta.</p>
                <RedirectButton buttonText="Explorar a estante" href="/shelf"/>
            </section>

            <div className="container py-5">
                {/* ===== Atalhos ===== */}
                <section className="row g-3 mb-5">
                    {atalhos.map((atalho) => (
                        <div key={atalho.titulo} className="col-6 col-lg-3">
                            <Link href={atalho.href} className={`card h-100 text-decoration-none ${styles.atalho}`}>
                                <div className="card-body d-flex flex-column gap-2">
                                    <img src={atalho.icone} alt="" width="32" height="32"/>
                                    <h5 className="card-title mb-0">{atalho.titulo}</h5>
                                    <p className="card-text small mb-0">{atalho.texto}</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </section>

                {/* ===== Pedidos recentes + dados da conta ===== */}
                <section className="row g-4 mb-5">
                    <div id="pedidos" className="col-lg-8">
                        <div className="card h-100">
                            <div className="card-header d-flex align-items-center justify-content-between">
                                <h5 className="mb-0">Pedidos recentes</h5>
                                <span className="badge text-bg-secondary">{pedidosExemplo.length}</span>
                            </div>
                            {pedidosExemplo.length > 0 ? (
                                <ul className="list-group list-group-flush">
                                    {pedidosExemplo.map((pedido) => (
                                        <li key={pedido.id} className="list-group-item d-flex flex-wrap align-items-center justify-content-between gap-2">
                                            <div>
                                                <h6 className="mb-0">Pedido #{pedido.id}</h6>
                                                <small>{pedido.data}</small>
                                            </div>
                                            <div className="d-flex align-items-center gap-3">
                                                <span className={`badge text-bg-${corDoStatus[pedido.status]}`}>{pedido.status}</span>
                                                <strong>{formatarMoeda(pedido.total)}</strong>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="card-body">
                                    <div className="alert alert-light mb-0" role="alert">
                                        Você ainda não fez nenhum pedido. Que tal começar pela nossa estante?
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div id="dados" className="col-lg-4">
                        <div className="card h-100">
                            <div className="card-header">
                                <h5 className="mb-0">Minha conta</h5>
                            </div>
                            <div className="card-body d-flex flex-column justify-content-between gap-3">
                                <dl className="row mb-0">
                                    <dt className="col-4">Nome</dt>
                                    <dd className="col-8">{usuario.nome}</dd>
                                    <dt className="col-4">E-mail</dt>
                                    <dd className="col-8 text-break mb-0">{usuario.email}</dd>
                                </dl>
                                <span className="badge text-bg-light border align-self-start">Cliente</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== Sugestões de leitura ===== */}
                <section>
                    <div className="d-flex align-items-end justify-content-between mb-3">
                        <div>
                            <h2 className={styles.section_title}>Escolhidos para você</h2>
                            <p className="mb-0">Algumas histórias da nossa estante para a sua próxima leitura.</p>
                        </div>
                        <Link href="/shelf" className={styles.link_ver_todos}>Ver todos</Link>
                    </div>

                    {carregandoLivros ? (
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Carregando livros...</span>
                        </div>
                    ) : erroLivros ? (
                        <div className="alert alert-danger" role="alert">{erroLivros}</div>
                    ) : livros.length > 0 ? (
                        <div className="d-flex flex-wrap gap-4">
                            {livros.map((livro) => (
                                <BookCard key={livro.id} book={livro}/>
                            ))}
                        </div>
                    ) : (
                        <div className="alert alert-light" role="alert">Nossa estante está vazia por enquanto. Volte mais tarde!</div>
                    )}
                </section>
            </div>
        </main>
    );
}
