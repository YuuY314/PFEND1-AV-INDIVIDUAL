import RedirectButton from "../RedirectButton";
import styles from "./homeBanner.module.css";

export default function HomeBanner(){
    return (
        <section className={`d-flex p-5 justify-content-center ${styles.home_banner}`}>
            <div className="d-flex flex-column gap-4">
                <p className={styles.alt_color}>PARA QUEM AMA BOAS HISTÓRIAS</p>
                <h1>
                    Livraria Entrelinhas.
                    <br/>
                    A sua próxima história 
                    <br/>
                    começa <span>aqui.</span>
                </h1>
                <p>Entre páginas e descobertas, um livro espera por você. Encontre leituras que inspiram, acolhem e ficam.</p>
                <RedirectButton buttonText="Explore nossos livros" href="shelf" className="w-25"/>
            </div>
        </section>
    );
}