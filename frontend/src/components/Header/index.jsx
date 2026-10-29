"use client";

import styles from "./header.module.css";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Header(){
    const [ user, setUser ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ searchTerm, setSearchTerm ] = useState("");

    useEffect(() => {
        fetch("http://localhost:3001/api/autenticar/me", { credentials: "include" })
            .then(res => res.json())
            .then(data => setUser(data.autenticado ? data.dados : null))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    function handleSearch(event) {
        event.preventDefault();

        const text = searchTerm.trim();

        window.location.href = text ? `/shelf?search=${encodeURIComponent(text)}` : "/shelf";
    }

    async function handleLogout() {
        await fetch("http://localhost:3001/api/autenticar/logout", {
            method: "POST",
            credentials: "include",
        });

        window.location.href = "/";
    }

    return (
        <header className={`d-flex align-items-center justify-content-around p ${styles.header}`}>
            <Link href="/">
                <div className={"d-flex align-items-center gap-2"}>
                    <img src="/logo.png" alt="Logo da Entrelinhas"/>
                    <h1>Entrelinhas</h1>
                </div>
            </Link>
            <nav className="d-flex align-items-center justify-content-between w-50">
                <form className="input-group w-50" role="search" onSubmit={handleSearch}>
                    <input
                        type="search"
                        className="form-control"
                        id="fieldText"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Busque por título, autor ou uma nova história"
                    />
                    <button type="submit" className={`btn ${styles.search_button}`}>Buscar</button>
                </form>
                <div className="d-flex align-items-center gap-5">
                    <Link href="/favorites"><img src="/heart.png" alt="Favoritos"/></Link>
                    <Link href="/bag"><img src="/bag.png" alt="Sacola"/></Link>
                    {loading ? (
                        <span className="placeholder-glow">
                            <span className={`placeholder rounded ${styles.user_placeholder}`}></span>
                        </span>
                    ) : user ? (
                        <div className={`dropdown ${styles.user_dropdown}`}>
                            <button type="button" className={`dropdown-toggle d-flex align-items-center gap-2 ${styles.user_toggle}`}>
                                <img src="/user.png" alt=""/>
                                <h5>{user.nome.split(" ")[0]}</h5>
                            </button>
                            <ul className={`dropdown-menu dropdown-menu-end mt-0 ${styles.user_menu}`} data-bs-popper="static">
                                <li><h6 className="dropdown-header">{user.email}</h6></li>
                                <li><Link className="dropdown-item" href={user.tipo === "administrador" ? "/admin" : "/user"}>Minha área</Link></li>
                                <li><hr className="dropdown-divider"/></li>
                                <li><button type="button" className="dropdown-item" onClick={handleLogout}>Sair</button></li>
                            </ul>
                        </div>
                    ) : (
                        <Link href="/login" className="d-flex gap-2 align-items-center">
                            <img src="/user.png" alt=""/> <h5>Entrar</h5>
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    );
}
