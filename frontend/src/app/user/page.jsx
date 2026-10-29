"use client";

import styles from "./user.module.css";

import { useEffect, useState } from "react";
import Link from "next/link";

import BookCard from "@/components/BookCard";
import RedirectButton from "@/components/RedirectButton";
import { formatCurrency } from "@/utils/formatCurrency.js";

const shortcuts = [
    { title: "Meus pedidos", text: "Acompanhe suas compras.", icon: "/bag.png", href: "#orders" },
    { title: "Favoritos", text: "Os livros que você quer ler.", icon: "/heart.png", href: "/favorites" },
    { title: "Ofertas", text: "Promoções para presentear.", icon: "/gift.png", href: "/shelf" },
    { title: "Meus dados", text: "Confira as informações da conta.", icon: "/user.png", href: "#account" },
];

// dados fixos (tabela "pedidos" já está na migration)
const sampleOrders = [
    { id: 1024, date: "21/10/2026", status: "Enviado", total: 89.8 },
    { id: 1017, date: "02/10/2026", status: "Entregue", total: 45.9 },
    { id: 1009, date: "18/09/2026", status: "Cancelado", total: 32 },
];

// Cada status do ENUM de pedidos recebe uma cor de badge do Bootstrap
const statusColor = {
    Pendente: "warning",
    Confirmado: "info",
    Enviado: "primary",
    Entregue: "success",
    Cancelado: "danger",
};

export default function User(){
    const [ user, setUser ] = useState(null);
    const [ loading, setLoading ] = useState(true);

    const [ books, setBooks ] = useState([]);
    const [ booksLoading, setBooksLoading ] = useState(true);
    const [ booksError, setBooksError ] = useState("");

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
                    setUser(data.dados);
                }
            })
            .catch(() => { window.location.href = "/login"; })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!user) return;

        fetch("http://localhost:3001/api/livro")
            .then((res) => {
                if (!res.ok) throw new Error("Não foi possível carregar as sugestões.");
                return res.json();
            })
            .then((data) => setBooks((data.dados ?? []).slice(0, 6)))
            .catch((error) => setBooksError(error.message))
            .finally(() => setBooksLoading(false));
    }, [user]);

    if (loading || !user) {
        return (
            <main className="d-flex align-items-center justify-content-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
            </main>
        );
    }

    const firstName = user.nome?.trim().split(" ")[0] || "leitor";

    return (
        <main>
            <section className={`d-flex flex-column align-items-start gap-3 p-5 ${styles.user_banner}`}>
                <p className={styles.alt_color}>ÁREA DO LEITOR</p>
                <h1>Olá, {firstName}!</h1>
                <p>Que bom ter você de volta. Veja seus pedidos, descubra novas leituras e cuide da sua conta.</p>
                <RedirectButton buttonText="Explorar a estante" href="/shelf"/>
            </section>

            <div className="container py-5">
                <section className="row g-3 mb-5">
                    {shortcuts.map((shortcut) => (
                        <div key={shortcut.title} className="col-6 col-lg-3">
                            <Link href={shortcut.href} className={`card h-100 text-decoration-none ${styles.shortcut}`}>
                                <div className="card-body d-flex flex-column gap-2">
                                    <img src={shortcut.icon} alt="" width="32" height="32"/>
                                    <h5 className="card-title mb-0">{shortcut.title}</h5>
                                    <p className="card-text small mb-0">{shortcut.text}</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </section>

                <section className="row g-4 mb-5">
                    <div id="orders" className="col-lg-8">
                        <div className="card h-100">
                            <div className="card-header d-flex align-items-center justify-content-between">
                                <h5 className="mb-0">Pedidos recentes</h5>
                                <span className="badge text-bg-secondary">{sampleOrders.length}</span>
                            </div>
                            {sampleOrders.length > 0 ? (
                                <ul className="list-group list-group-flush">
                                    {sampleOrders.map((order) => (
                                        <li key={order.id} className="list-group-item d-flex flex-wrap align-items-center justify-content-between gap-2">
                                            <div>
                                                <h6 className="mb-0">Pedido #{order.id}</h6>
                                                <small>{order.date}</small>
                                            </div>
                                            <div className="d-flex align-items-center gap-3">
                                                <span className={`badge text-bg-${statusColor[order.status]}`}>{order.status}</span>
                                                <strong>{formatCurrency(order.total)}</strong>
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

                    <div id="account" className="col-lg-4">
                        <div className="card h-100">
                            <div className="card-header">
                                <h5 className="mb-0">Minha conta</h5>
                            </div>
                            <div className="card-body d-flex flex-column justify-content-between gap-3">
                                <dl className="row mb-0">
                                    <dt className="col-4">Nome</dt>
                                    <dd className="col-8">{user.nome}</dd>
                                    <dt className="col-4">E-mail</dt>
                                    <dd className="col-8 text-break mb-0">{user.email}</dd>
                                </dl>
                                <span className="badge text-bg-light border align-self-start">Cliente</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="d-flex align-items-end justify-content-between mb-3">
                        <div>
                            <h2 className={styles.section_title}>Escolhidos para você</h2>
                            <p className="mb-0">Algumas histórias da nossa estante para a sua próxima leitura.</p>
                        </div>
                        <Link href="/shelf" className={styles.view_all_link}>Ver todos</Link>
                    </div>

                    {booksLoading ? (
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Carregando livros...</span>
                        </div>
                    ) : booksError ? (
                        <div className="alert alert-danger" role="alert">{booksError}</div>
                    ) : books.length > 0 ? (
                        <div className="d-flex flex-wrap gap-4">
                            {books.map((book) => (
                                <BookCard key={book.id} book={book}/>
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
