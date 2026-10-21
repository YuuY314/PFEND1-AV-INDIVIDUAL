import styles from "./redirectButton.module.css";

import Link from "next/link";

export default function RedirectButton({ buttonText, href = "/" }){
    return (
        <Link href={href} className={`btn d-flex align-items-center gap-1 px-4 ${styles.redirect_button}`}>
            {buttonText}
            <img src="arrow-right.png" />
        </Link>
    );
}