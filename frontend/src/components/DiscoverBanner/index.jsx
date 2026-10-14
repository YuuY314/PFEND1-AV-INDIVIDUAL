import styles from "./discoverBanner.module.css";

export default function DiscoverBanner({h6, h2, p, buttonText}){
    return (
        <section className={`d-flex align-items-center justify-content-around ${styles.discover_banner}`}>
            <div className="d-flex flex-column gap-1">
                <h6>{h6}</h6>
                <h2>{h2}</h2>
                <p>{p}</p>
            </div>
            <button type="button" className="btn d-flex align-items-center gap-1">
                {buttonText}
                <img src="arrow-right.png" />
            </button>
        </section>
    );
}