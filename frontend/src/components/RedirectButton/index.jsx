import styles from "./redirectButton.module.css";

export default function RedirectButton({ buttonText }){
    return (
        <button type="button" className={`btn d-flex align-items-center gap-1 px-4 ${styles.redirect_button}`}>
            {buttonText}
            <img src="arrow-right.png" />
        </button>
    );
}