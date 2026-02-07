import { useTranslations } from "next-intl";
import { ScrollReveal } from "./ScrollReveal";
import styles from "./Contact.module.css";

export function Contact() {
    const t = useTranslations("contact");

    return (
        <section id="contact" className={`section ${styles.contact}`}>
            <div className="container">
                <ScrollReveal>
                    <h2 className="section-heading">{t("heading")}</h2>
                </ScrollReveal>
                <ScrollReveal delay={100}>
                    <div className={styles.contactInner}>
                        <p className={styles.description}>{t("description")}</p>
                        <div className={styles.actions}>
                            <a href="mailto:hello@example.com" className={styles.btnPrimary}>
                                ✉ {t("email")}
                            </a>
                            <a href="#" className={styles.btnSecondary}>
                                ↓ {t("resume")}
                            </a>
                        </div>
                        <div className={styles.socials}>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialLink}
                                aria-label="LinkedIn"
                            >
                                in
                            </a>
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialLink}
                                aria-label="GitHub"
                            >
                                GH
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialLink}
                                aria-label="Twitter"
                            >
                                𝕏
                            </a>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
