import styles from "./discoverBanner.module.css";

import RedirectButton from "../RedirectButton";

export default function DiscoverBanner({h6, h2, p, buttonText }){
    return (
        <section className={`d-flex align-items-center justify-content-around ${styles.discover_banner}`}>
            <div className="d-flex flex-column gap-1">
                <h6>{h6}</h6>
                <h2>{h2}</h2>
                <p>{p}</p>
            </div>
            <RedirectButton buttonText={buttonText}/>
        </section>
    );
}