import styles from "./navbar.module.css";

import Link from "next/link";

export default function Navbar(){
    const genres = [
        "Todos os Livros",
        "Lançamentos",
        "Ofertas especiais",
        "Literatura brasileira",
        "Fantasia",
        "Romance",
        "Clássicos",
        "Infantojuvenil"
    ];

    return (
        <nav className={`d-flex align-items-center justify-content-evenly ${styles.navbar}`}>
            {
                genres.map((g, idx) => (
                    <Link key={idx} href="/" className="px-3">{g}</Link>
                ))
            }
        </nav>
    )
}