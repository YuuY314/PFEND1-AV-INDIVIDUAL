"use client"

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import styles from "./book.module.css";
import { formatCurrency } from "@/utils/formatCurrency";

export default function Book(){
    const params = useParams();
    const [ book, setBook ] = useState();
    const [ error, setError ] = useState("");
    const [ quantity, setQuantity ] = useState(1);
    const [ sending, setSending ] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:3001/api/livro/${params.id}`)
        .then(res => res.json())
            .then(data => {
                console.log(data)
                setBook(data.dados);
                setError("");
            })
        .catch(error => setError(error.message));
    }, []);

    async function buy(event) {
        event.preventDefault();
        setError(null);
        setSending(true);

        try {
            const response = await fetch(
                `http://localhost:3001/api/livro/${params.id}/estoque`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ quantidade: Number(quantity) }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.erro || "Não foi possível concluir a compra.");
            }

            setBook(result.dados);
            setError({ type: "success", text: result.mensagem });
        } catch (error) {
            setError({ type: "danger", text: error.message });
        } finally {
            setSending(false);
        }
    }

    return (
        <main className={`d-flex flex-column justify-content-center ${styles.book_main}`}>
            { book && 
                <section className="d-flex justify-content-center gap-5">
                    <img src={book.imagem_url} alt="" className="w-25" />
                    <div className="w-25">
                        <h1>{book.titulo}</h1>
                        <h4>{book.autor}</h4>
                        <h2>{formatCurrency(book.preco)}</h2>
                        <h5>Em estoque: {book.estoque}</h5>

                        <hr />

                        <h3>Categoria</h3>
                        <h5>{book.categoria}</h5>
                        <h3>Descrição</h3>
                        <p>{book.descricao}</p>

                        <form onSubmit={buy} className="d-flex flex-column gap-3">
                            <div className="input-group">
                                <label htmlFor="quantity" className="input-group-text">Quantidade</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="quantity"
                                    min="1"
                                    max={book.estoque}
                                    value={quantity}
                                    onChange={(event) => setQuantity(event.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                className={`btn ${styles.buy_button}`}
                                disabled={sending || book.estoque === 0}
                            >
                                {book.estoque === 0 ? "Esgotado" : "Comprar"}
                            </button>
                            {error && (
                                <div className={`alert alert-${error.type} mb-0`} role="alert">
                                    {error.text}
                                </div>
                            )}
                        </form>
                    </div>
                </section>
            }
        </main>
    );
}