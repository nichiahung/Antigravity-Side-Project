import { useTranslations } from "next-intl";
import { ScrollReveal } from "./ScrollReveal";
import styles from "./About.module.css";

export function About() {
    const t = useTranslations("about");

    const stats = [
        { value: "5+", label: t("stats.years") },
        { value: "8+", label: t("stats.products") },
        { value: "30+", label: t("stats.teams") },
    ];

    return (
        <section id="about" className={`section ${styles.about}`}>
            <div className="container">
                <ScrollReveal>
                    <h2 className="section-heading">{t("heading")}</h2>
                </ScrollReveal>
                <div className={styles.grid}>
                    <ScrollReveal delay={100}>
                        <div className={styles.imageWrap}>
                            <div className={styles.imagePlaceholder}>👤</div>
                        </div>
                    </ScrollReveal>
                    <ScrollReveal delay={200}>
                        <div className={styles.content}>
                            <p className={styles.description}>{t("description")}</p>
                            <div className={styles.stats}>
                                {stats.map((stat) => (
                                    <div key={stat.label} className={styles.statItem}>
                                        <div className={styles.statNumber}>{stat.value}</div>
                                        <div className={styles.statLabel}>{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
}
