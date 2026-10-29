import styles from "./inProgress.module.css";

import RedirectButton from "../RedirectButton";

export default function InProgress({ title, text, icon }) {
    return (
        <main className={`d-flex flex-column align-items-center justify-content-center text-center gap-3 p-5 ${styles.in_progress}`}>
            <img src={icon} alt="" width="64" height="64"/>
            <span className={`badge rounded-pill ${styles.progress_badge}`}>Em progresso</span>
            <h1 className={styles.progress_title}>{title}</h1>
            <p className={styles.progress_text}>{text}</p>
            <RedirectButton buttonText="Explorar a estante" href="/shelf"/>
        </main>
    );
}
