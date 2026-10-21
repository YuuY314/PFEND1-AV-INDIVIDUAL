import styles from "./bookCard.module.css";

import Link from "next/link";

export default function BookCard(){
    return (
        <Link href="" className={styles.book_card}>
            <div className="d-flex flex-column gap-3">
                <img src="livro1.png" className="object-fit-contain"/>
                <div>
                    <h5>A Guerra dos Tronos</h5>
                    <p>Autor</p>
                    <h6>R$ 39,90</h6>
                </div>
            </div>
        </Link>
    );
}