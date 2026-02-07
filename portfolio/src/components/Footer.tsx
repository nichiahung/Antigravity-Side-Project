import { useTranslations } from "next-intl";
import styles from "./Footer.module.css";

export function Footer() {
    const t = useTranslations("footer");
    const year = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.footerInner}`}>
                <p className={styles.copyright}>
                    © {year} Conrad. {t("rights")}
                </p>
                <a href="#hero" className={styles.backToTop}>
                    ↑ Top
                </a>
            </div>
        </footer>
    );
}
