"use client"

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import styles from "./book.module.css";

export default function Book(){
    const params = useParams();
    const [ book, setBook ] = useState();
    const [ error, setError ] = useState("");

    useEffect(() => {
        fetch(`http://localhost/api/livro/${params.id}`)
        .then(res => res.json())
            .then(data => {
                setBook(data);
                setError("");
            })
        .catch(error => setError(error.message));
    }, []);

    return (
        <main className={styles.main}>
            { book && 
                <section className={styles.book_info}>
                    <img src={book.imagem_url} alt="" />
                    <div>
                        <h1>{book.titulo}</h1>
                    </div>
                </section>
            }
        </main>
    );
}