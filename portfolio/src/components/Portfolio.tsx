import { useTranslations } from "next-intl";
import { ScrollReveal } from "./ScrollReveal";
import styles from "./Portfolio.module.css";

const projects = [
    {
        title: "Enterprise SaaS Dashboard",
        description:
            "Led product strategy for a B2B analytics dashboard serving 500+ enterprise clients. Defined core metrics, user flows, and feature prioritization.",
        tags: ["Product Strategy", "B2B", "Analytics", "Agile"],
        emoji: "📊",
    },
    {
        title: "Mobile Payment Platform",
        description:
            "Managed the end-to-end development of a mobile payment solution. Coordinated with compliance, backend, and design teams across 3 time zones.",
        tags: ["FinTech", "Mobile", "Cross-functional", "Compliance"],
        emoji: "💳",
    },
    {
        title: "AI-Powered Customer Support",
        description:
            "Defined PRD and roadmap for an AI chatbot that reduced support tickets by 60%. Collaborated with ML engineers on model evaluation and iteration.",
        tags: ["AI/ML", "Chatbot", "PRD", "User Research"],
        emoji: "🤖",
    },
    {
        title: "Internal Tools Platform",
        description:
            "Built an internal tooling ecosystem that improved developer experience and reduced deployment time by 45%. Drove adoption across 8 engineering teams.",
        tags: ["DevEx", "Internal Tools", "Platform", "Adoption"],
        emoji: "🛠",
    },
];

export function Portfolio() {
    const t = useTranslations("portfolio");

    return (
        <section id="portfolio" className={`section ${styles.portfolio}`}>
            <div className="container">
                <ScrollReveal>
                    <h2 className="section-heading">{t("heading")}</h2>
                </ScrollReveal>
                <div className={styles.grid}>
                    {projects.map((project, i) => (
                        <ScrollReveal key={i} delay={i * 100}>
                            <div className={styles.card}>
                                <div className={styles.cardImage}>{project.emoji}</div>
                                <div className={styles.cardBody}>
                                    <h3 className={styles.cardTitle}>{project.title}</h3>
                                    <p className={styles.cardDesc}>{project.description}</p>
                                    <div className={styles.cardTags}>
                                        {project.tags.map((tag) => (
                                            <span key={tag} className={styles.cardTag}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
