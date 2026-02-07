import { useTranslations } from "next-intl";
import { ScrollReveal } from "./ScrollReveal";
import styles from "./Experience.module.css";

const experiences = [
    {
        role: "Senior Product Manager",
        company: "TechCorp",
        period: "2022 — Present",
        description:
            "Led a cross-functional team of 15 to deliver a B2B SaaS platform from 0 to 1. Defined product vision, managed roadmap, and drove 3x user growth through data-informed iteration.",
        highlights: ["B2B SaaS", "0-to-1", "Team of 15", "3x Growth"],
    },
    {
        role: "Product Manager",
        company: "InnovateLab",
        period: "2020 — 2022",
        description:
            "Owned the mobile app product line, coordinating with engineering, design, and marketing. Launched 4 major features, improving user retention by 40%.",
        highlights: ["Mobile App", "Feature Launches", "+40% Retention"],
    },
    {
        role: "Associate Product Manager",
        company: "StartupHub",
        period: "2018 — 2020",
        description:
            "Conducted user research, wrote PRDs, and supported sprint planning. Participated in product discovery for 2 new product lines.",
        highlights: ["User Research", "PRD", "Agile", "Product Discovery"],
    },
];

export function Experience() {
    const t = useTranslations("experience");

    return (
        <section id="experience" className={`section ${styles.experience}`}>
            <div className="container">
                <ScrollReveal>
                    <h2 className="section-heading">{t("heading")}</h2>
                </ScrollReveal>
                <div className={styles.timeline}>
                    {experiences.map((exp, i) => (
                        <ScrollReveal key={i} delay={i * 120}>
                            <div className={styles.timelineItem}>
                                <div className={styles.dot} />
                                <div className={styles.timelineHeader}>
                                    <span className={styles.role}>{exp.role}</span>
                                    <span className={styles.company}>@ {exp.company}</span>
                                    <span className={styles.period}>{exp.period}</span>
                                </div>
                                <p className={styles.description}>{exp.description}</p>
                                <div className={styles.highlights}>
                                    {exp.highlights.map((h) => (
                                        <span key={h} className={styles.highlight}>
                                            {h}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
