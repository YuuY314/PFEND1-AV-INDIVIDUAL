import styles from "./brandBanner.module.css";

export default function BrandBanner(){
    return (
        <section className={`d-flex justify-content-evenly py-4 ${styles.brand_banner}`}>
            <div className="d-flex gap-3">
                <img src="logo.png"/>
                <div>
                    <p><span>Curadoria Especial</span></p>
                    <p>Boas histórias, escolhidas a dedo</p>
                </div>
            </div>
            <div className="d-flex gap-3">
                <img src="gift.png"/>
                <div>
                    <p><span>Um presente para lembrar</span></p>
                    <p>Livros para todos os momentos</p>
                </div>
            </div>
            <div className="d-flex gap-3">
                <img src="heart.png"/>
                <div>
                    <p><span>Paixão pela leitura</span></p>
                    <p>Clássicos que atravessam gerações</p>
                </div>
            </div>
            <div className="d-flex gap-3">
                <img src="circle-check.png"/>
                <div>
                    <p><span>Cuidado em cada página</span></p>
                    <p>Uma seleção feita com carinho</p>
                </div>
            </div>
        </section>
    );
}