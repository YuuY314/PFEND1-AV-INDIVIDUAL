"use client"

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import styles from "./book.module.css";
import { formatarMoeda } from "@/utils/formatarMoeda";

export default function Book(){
    const params = useParams();
    const [ book, setBook ] = useState();
    const [ error, setError ] = useState("");

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

    return (
        <main className={`d-flex flex-column justify-content-center ${styles.book_main}`}>
            { book && 
                <section className="d-flex justify-content-center gap-5">
                    <img src={book.imagem_url} alt="" className="w-25" />
                    <div className="w-25">
                        <h1>{book.titulo}</h1>
                        <h4>{book.autor}</h4>
                        <h2>{formatarMoeda(book.preco)}</h2>
                        <h5>Em estoque: {book.estoque}</h5>
                        <hr />

                        <h3>Categoria</h3>
                        <h5>{book.categoria}</h5>
                        <h3>Descrição</h3>
                        <p>{book.descricao}</p>
                    </div>
                </section>
            }
        </main>
    );
}