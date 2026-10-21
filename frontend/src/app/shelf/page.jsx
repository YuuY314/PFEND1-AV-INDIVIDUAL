import BookCard from "@/components/BookCard";
import styles from "./shelf.module.css";

export default function Shelf(){
    return (
        <main className="d-flex justify-content-center gap-5 p-5">
            <section className={styles.shelf_sidebar}>
                <div>
                    <h6>CATEGORIAS</h6>
                    <div className="form-field d-flex gap-2">
                        <input type="checkbox" id="checkLabel" className="check" />
                        <label htmlFor="checkLabel">Fantasia</label>
                    </div>
                    <div className="form-field d-flex gap-2">
                        <input type="checkbox" id="checkLabel" className="check" />
                        <label htmlFor="checkLabel">Romance</label>
                    </div>
                    <div className="form-field d-flex gap-2">
                        <input type="checkbox" id="checkLabel" className="check" />
                        <label htmlFor="checkLabel">Clássicos</label>
                    </div>
                    <div className="form-field d-flex gap-2">
                        <input type="checkbox" id="checkLabel" className="check" />
                        <label htmlFor="checkLabel">Infantojuvenil</label>
                    </div>
                </div>
                <hr/>
                <div>
                    <h6>FAIXA DE PREÇO</h6>
                    <div className="form-field d-flex gap-2">
                        <input className="radio" name="radios" type="radio" id="radioLabel" />
                        <label htmlFor="radioLabel">Todas as ofertas</label>
                    </div>
                    <div className="form-field d-flex gap-2">
                        <input className="radio" name="radios" type="radio" id="radioLabel2" />
                        <label htmlFor="radioLabel2">Até R$ 30</label>
                    </div>
                    <div className="form-field d-flex gap-2">
                        <input className="radio" name="radios" type="radio" id="radioLabel2" />
                        <label htmlFor="radioLabel2">R$ 30 a R$ 45</label>
                    </div>
                    <div className="form-field d-flex gap-2">
                        <input className="radio" name="radios" type="radio" id="radioLabel2" />
                        <label htmlFor="radioLabel2">Acima de R$ 45</label>
                    </div>
                </div>
            </section>
            <section className={`d-flex flex-column gap-4 ${styles.shelf_main}`}>
                <section className={styles.shelf_navbar}>
                    <h2>Nossa estante</h2>
                    <p>Use os filtros para encontrar exatamente a história que você procura.</p>
                    <div className="d-flex align-items-center justify-content-between">
                        <p>18 livros encontrados</p>
                        <div className="form-field">
                            <label htmlFor="exampleFormControlSelect2" className="form-label">
                                Example select
                            </label>
                            <select className="form-control" id="exampleFormControlSelect2">
                                <option value={1}>One</option>
                                <option value={2}>Two</option>
                                <option value={3}>Three</option>
                            </select>
                        </div>
                    </div>
                </section>
                <section>
                    <BookCard/>
                </section>
            </section>
        </main>
    );
}