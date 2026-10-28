"use client";

import styles from "./header.module.css";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Header(){
    const [ usuario, setUsuario ] = useState(null);
    const [ carregando, setCarregando ] = useState(true);

    // Pergunta ao backend se existe alguém logado (sessão)
    useEffect(() => {
        fetch("http://localhost:3001/api/autenticar/me", { credentials: "include" })
            .then(res => res.json())
            .then(data => setUsuario(data.autenticado ? data.dados : null))
            .catch(() => setUsuario(null))
            .finally(() => setCarregando(false));
    }, []);

    async function sair() {
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
                <div className="form-field w-50">
                    <input type="text" className="form-control" id="fieldText" placeholder="Busque por título, autor ou uma nova história"/>
                </div>
                <div className="d-flex align-items-center gap-5">
                    <Link href="/favorites"><img src="/heart.png" alt="Favoritos"/></Link>
                    <Link href="/bag"><img src="/bag.png" alt="Sacola"/></Link>
                    {carregando ? (
                        <span className="placeholder-glow">
                            <span className={`placeholder rounded ${styles.user_placeholder}`}></span>
                        </span>
                    ) : usuario ? (
                        // Dropdown do Bootstrap: o menu aparece no hover (regra em header.module.css)
                        <div className={`dropdown ${styles.user_dropdown}`}>
                            <button type="button" className={`dropdown-toggle d-flex align-items-center gap-2 ${styles.user_toggle}`}>
                                <img src="/user.png" alt=""/>
                                <h5>{usuario.nome.split(" ")[0]}</h5>
                            </button>
                            <ul className={`dropdown-menu dropdown-menu-end mt-0 ${styles.user_menu}`} data-bs-popper="static">
                                <li><h6 className="dropdown-header">{usuario.email}</h6></li>
                                <li><Link className="dropdown-item" href="/user">Minha área</Link></li>
                                <li><hr className="dropdown-divider"/></li>
                                <li><button type="button" className="dropdown-item" onClick={sair}>Sair</button></li>
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
