import { useTranslations } from "next-intl";
import styles from "./Hero.module.css";

export function Hero() {
    const t = useTranslations("hero");

    return (
        <section id="hero" className={styles.hero}>
            <div className={`container ${styles.heroInner}`}>
                <p className={styles.greeting}>{t("greeting")}</p>
                <h1 className={styles.name}>
                    {t("name")}
                    <span className={styles.nameAccent}>.</span>
                </h1>
                <p className={styles.title}>{t("title")}</p>
                <p className={styles.tagline}>{t("tagline")}</p>
                <a href="#about" className={styles.cta}>
                    {t("cta")}
                    <span className={styles.ctaArrow}>→</span>
                </a>
            </div>
            <div className={styles.decorCircle} aria-hidden="true" />
        </section>
    );
}
