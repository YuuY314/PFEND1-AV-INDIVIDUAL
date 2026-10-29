"use client";

import styles from "./login.module.css";

import { useState } from "react";
import Link from "next/link";

export default function Login(){
    const [ error, setError ] = useState("");

    async function makeLogin(event) {
        event.preventDefault();
        setError("");

        const form = event.currentTarget;
        const fields = new FormData(form);

        try {
            const response = await fetch(
                "http://localhost:3001/api/autenticar/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        email: fields.get("email"),
                        senha: fields.get("password"),
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.erro ||
                    result.mensagem ||
                    "Não foi possível realizar o login."
                );
            }

            if (result.dados.tipo === "cliente") {
                window.location.href = "/user";
            } else if (result.dados.tipo === "profissional") {
                window.location.href = "/admin";
            } else {
                throw new Error("Tipo de usuário desconhecido.");
            }
        } catch (error) {
            setError(error.message || "Erro ao conectar com o servidor.");
        }
    }

    return (
        <main className="d-flex">
            <section className={`d-flex flex-column align-items-center justify-content-center p-5 ${styles.login_banner}`}>
                <div>
                    <p className={styles.alt_color}>LIVRARIA ENTRELINHAS</p>
                    <h1>Há sempre uma história esperando por você.</h1>
                    <p>Entre páginas, descobertas e novos começos.</p>
                </div>
            </section>
            <section className={`d-flex flex-column justify-content-center p-5 ${styles.login_form}`}>
                <form onSubmit={makeLogin} className="d-flex flex-column gap-3">
                    <h2 className="text-center">Entrar</h2>
                    <div className="form-field">
                        <label htmlFor="email" className="form-label">E-mail</label>
                        <input type="email" className="form-control" name="email" id="email" placeholder="Insira o seu e-mail"/>
                    </div>
                    <div className="form-field">
                        <label htmlFor="password" className="form-label">Senha</label>
                        <input type="password" className="form-control" name="password" id="password" placeholder="Insira sua senha"/>
                    </div>
                    <p className="text-end">Ainda não é um leitor? <Link href="register">Cadastre-se</Link></p>
                    <button type="submit" className="btn">Acessar</button>
                    {error !== "" && <p>Erro: {error}</p>}
                </form>
            </section>
        </main>
    );
}