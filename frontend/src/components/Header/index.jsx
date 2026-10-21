import styles from "./header.module.css";

import Link from "next/link";

export default function Header(){
    return (
        <header className={`d-flex align-items-center justify-content-around p ${styles.header}`}>
            <Link href="/">
                <div className={"d-flex align-items-center gap-2"}>
                    <img src="logo.png"/>
                    <h1>Entrelinhas</h1>
                </div>
            </Link>
            <nav className="d-flex align-items-center justify-content-between w-50">
                <div className="form-field w-50">
                    <input type="text" className="form-control" id="fieldText" placeholder="Busque por título, autor ou uma nova história"/>
                </div>
                <div className="d-flex align-items-center gap-5">
                    <Link href="favorites"><img src="heart.png"/></Link>
                    <Link href="bag"><img src="bag.png"/></Link>
                    <Link href="login"className="d-flex gap-2 align-items-center"><img src="user.png"/> <h5>Entrar</h5></Link>
                </div>
            </nav>
        </header>
    );
}