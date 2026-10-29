"use client";

import styles from "./register.module.css";

import { useState } from "react";
import Link from "next/link";

export default function Register(){
    const [message, setMessage] = useState("");
    
    async function registerUser(event) {
        event.preventDefault();
        setMessage("");

        const form = event.currentTarget;
        const fields = new FormData(form);
        const password = fields.get("password");

        if (password !== fields.get("password-confirm")) {
            setMessage("As senhas não coincidem.");
            return;
        }

        if (password.length < 8) {
            setMessage("A senha deve ter pelo menos 8 caracteres.");
            return;
        }

        const userData = {
            nome: fields.get("name"),
            email: fields.get("email"),
            senha: fields.get("password")
        };

        try {
            const response = await fetch("http://localhost:3001/api/cliente", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData)
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok || result.sucesso === false)
                throw new Error(result.message || result.erro || "Não foi possível cadastrar o cliente.");

            setMessage(result.message || "Cadastro realizado com sucesso!");
            form.reset();
        } catch (error) {
            console.error("Erro ao cadastrar cliente:", error);
            setMessage(error.message || "Não foi possível conectar ao servidor.");
        }
    }

    return (
        <main className="d-flex">
            <section className={`d-flex flex-column align-items-center justify-content-center p-5 ${styles.register_banner}`}>
                <div>
                    <p className={styles.alt_color}>LIVRARIA ENTRELINHAS</p>
                    <h1>Há sempre uma história esperando por você.</h1>
                    <p>Entre páginas, descobertas e novos começos.</p>
                </div>
            </section>
            <section className={`d-flex flex-column justify-content-center p-5 ${styles.register_form}`}>
                <form onSubmit={registerUser} className="d-flex flex-column gap-3">
                    <h2 className="text-center">Cadastro</h2>
                    <div className="form-field">
                        <label htmlFor="name" className="form-label">Nome</label>
                        <input type="text" className="form-control" name="name" id="name" placeholder="Insira o seu nome completo"/>
                    </div>
                    <div className="form-field">
                        <label htmlFor="email" className="form-label">E-mail</label>
                        <input type="email" className="form-control" name="email" id="email" placeholder="Insira o seu e-mail"/>
                    </div>
                    <div className="form-field">
                        <label htmlFor="password" className="form-label">Senha</label>
                        <input type="password" className="form-control" name="password" id="password" placeholder="Insira sua senha"/>
                    </div>
                    <div className="form-field">
                        <label htmlFor="password-confirm" className="form-label">Confirmar senha</label>
                        <input type="password" className="form-control" name="password-confirm" id="password-confirm" placeholder="Confirme sua senha"/>
                    </div>
                    <p className="text-end">Já é um leitor? <Link href="login">Entrar</Link></p>
                    <button type="submit" className="btn">Cadastrar</button>
                    {message !== "" && <p>{message}</p>}
                </form>
            </section>
        </main>
    );
}