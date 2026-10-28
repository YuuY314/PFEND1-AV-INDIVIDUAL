"use client";

import styles from "./header.module.css";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

export default function UserMenu({ usuario }){
    const [ aberto, setAberto ] = useState(false);
    const container = useRef(null);
    const ultimoPonteiro = useRef("");
    const { sair } = useAuth();
    const router = useRouter();

    const primeiroNome = usuario.nome?.trim().split(" ")[0] || "Minha conta";

    // Fecha ao clicar/tocar fora ou ao apertar Esc (necessário no celular, onde não existe "hover")
    useEffect(() => {
        if (!aberto) return;

        function aoClicarFora(event) {
            if (!container.current?.contains(event.target)) setAberto(false);
        }

        function aoTeclar(event) {
            if (event.key === "Escape") setAberto(false);
        }

        document.addEventListener("pointerdown", aoClicarFora);
        document.addEventListener("keydown", aoTeclar);

        return () => {
            document.removeEventListener("pointerdown", aoClicarFora);
            document.removeEventListener("keydown", aoTeclar);
        };
    }, [aberto]);

    // Mouse: abre/fecha ao passar por cima. Toque e teclado: abre/fecha no clique.
    function aoEntrar(event) {
        if (event.pointerType === "mouse") setAberto(true);
    }

    function aoSair(event) {
        if (event.pointerType === "mouse") setAberto(false);
    }

    function aoClicarNoBotao() {
        if (ultimoPonteiro.current === "mouse") return;
        setAberto((valorAtual) => !valorAtual);
    }

    async function handleSair() {
        setAberto(false);
        await sair();
        router.push("/");
        router.refresh();
    }

    return (
        <div
            ref={container}
            className="dropdown"
            onPointerEnter={aoEntrar}
            onPointerLeave={aoSair}
        >
            <button
                type="button"
                className={`dropdown-toggle d-flex align-items-center gap-2 ${styles.user_toggle}`}
                aria-haspopup="true"
                aria-expanded={aberto}
                onPointerDown={(event) => { ultimoPonteiro.current = event.pointerType; }}
                onKeyDown={() => { ultimoPonteiro.current = "teclado"; }}
                onClick={aoClicarNoBotao}
            >
                <img src="/user.png" alt=""/>
                <h5>{primeiroNome}</h5>
            </button>

            {/* data-bs-popper="static" faz o Bootstrap posicionar o menu sem precisar do JS do Popper */}
            <ul
                className={`dropdown-menu dropdown-menu-end mt-0 ${styles.user_menu} ${aberto ? "show" : ""}`}
                data-bs-popper="static"
            >
                <li>
                    <h6 className="dropdown-header">{usuario.email}</h6>
                </li>
                <li>
                    <Link className="dropdown-item" href="/user" onClick={() => setAberto(false)}>
                        Minha área
                    </Link>
                </li>
                <li><hr className="dropdown-divider"/></li>
                <li>
                    <button type="button" className="dropdown-item" onClick={handleSair}>
                        Sair
                    </button>
                </li>
            </ul>
        </div>
    );
}
