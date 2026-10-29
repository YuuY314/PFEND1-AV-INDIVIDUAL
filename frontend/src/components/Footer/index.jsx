import styles from "./footer.module.css";

import Link from "next/link";

export default function Footer(){
    return (
        <footer className={`d-flex align-items-center justify-content-between px-5 ${styles.footer}`}>
            <p>© 2026 Entrelinhas · Capas: <a href="https://openlibrary.org" target="_blank" rel="noreferrer">Open Library</a></p>
            <Link href="/"><img src="logo.png"/></Link>
        </footer>
    )
}