import Link from "next/link";
import { formatCurrency } from "@/utils/formatCurrency.js";

import styles from "./bookCard.module.css";

export default function BookCard({ book }){
    return (
        <Link href={`/books/${book.id}`} className={styles.book_card}>
            <div className="d-flex flex-column gap-3">
                <img src={book.imagem_url} alt={`Capa de ${book.titulo}`} className="object-fit-contain"/>
                <div>
                    <h5>{book.titulo}</h5>
                    <p>{book.autor}</p>
                    <h6>{formatCurrency(book.preco)}</h6>
                </div>
            </div>
        </Link>
    );
}