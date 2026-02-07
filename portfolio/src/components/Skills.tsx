import { useTranslations } from "next-intl";
import { ScrollReveal } from "./ScrollReveal";
import styles from "./Skills.module.css";

const skillData = {
    pm: [
        "Roadmap Planning",
        "User Story Mapping",
        "A/B Testing",
        "PRD / Spec Writing",
        "Stakeholder Management",
        "Sprint Planning",
        "OKR / KPI",
        "Competitive Analysis",
    ],
    tools: [
        "Jira",
        "Confluence",
        "Figma",
        "Notion",
        "Miro",
        "Amplitude",
        "Mixpanel",
        "Google Analytics",
    ],
    tech: [
        "REST API",
        "SQL",
        "Git",
        "CI/CD",
        "Cloud (AWS/GCP)",
        "System Design",
        "Data Modeling",
    ],
    soft: [
        "Cross-functional Leadership",
        "Data-driven Decision Making",
        "Agile / Scrum",
        "User Interviews",
        "Presentation",
        "Conflict Resolution",
    ],
};

export function Skills() {
    const t = useTranslations("skills");

    return (
        <section id="skills" className={`section ${styles.skills}`}>
            <div className="container">
                <ScrollReveal>
                    <h2 className="section-heading">{t("heading")}</h2>
                </ScrollReveal>
                <div className={styles.categories}>
                    {(Object.keys(skillData) as Array<keyof typeof skillData>).map(
                        (key, i) => (
                            <ScrollReveal key={key} delay={i * 100}>
                                <div className={styles.category}>
                                    <h3 className={styles.categoryTitle}>
                                        {t(`categories.${key}`)}
                                    </h3>
                                    <div className={styles.skillList}>
                                        {skillData[key].map((skill) => (
                                            <span key={skill} className={styles.skillTag}>
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </ScrollReveal>
                        )
                    )}
                </div>
            </div>
        </section>
    );
}
