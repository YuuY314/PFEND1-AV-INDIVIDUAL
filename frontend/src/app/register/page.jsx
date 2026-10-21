import styles from "./register.module.css";

import Link from "next/link";

export default function Register(){
    return (
        <main className="d-flex">
            <section className={`d-flex flex-column align-items-center justify-content-center w-50 p-5 ${styles.register_banner}`}>
                <div>
                    <p className={styles.alt_color}>LIVRARIA ENTRELINHAS</p>
                    <h1>Há sempre uma história esperando por você.</h1>
                    <p>Entre páginas, descobertas e novos começos.</p>
                </div>
            </section>
            <section className={`d-flex flex-column justify-content-center w-50 p-5 ${styles.register_form}`}>
                <form action="" className="d-flex flex-column gap-3">
                    <h2 className="text-center">Entrar</h2>
                    <div className="form-field">
                        <label htmlFor="email" className="form-label">E-mail</label>
                        <input type="email" className="form-control" id="email" placeholder="Insira o seu e-mail"/>
                    </div>
                    <div className="form-field">
                        <label htmlFor="password" className="form-label">Senha</label>
                        <input type="password" className="form-control" id="password" placeholder="Insira sua senha"/>
                    </div>
                    <p className="text-end">Ainda não é um leitor? <Link href="register">Cadastre-se</Link></p>
                    <button type="button" className="btn">Acessar</button>
                </form>
            </section>
        </main>
    );
}