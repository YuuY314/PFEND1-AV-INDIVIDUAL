import styles from "./page.module.css";

import DiscoverBanner from "@/components/DiscoverBanner";

export default function Home() {
  return (
    <main className={styles.main}>
      <section></section>
      <DiscoverBanner
        h6="ONDE A MAGIA GANHA VIDA, EM QUALQUER MUNDO"
        h2="Mundos extraordinários esperam por você."
        p="Atravesse reinos encantados, descubra criaturas lendárias e viva aventuras que só a fantasia pode proporcionar."
        buttonText="Descubra a fantasia"
      />
    </main>
  );
}