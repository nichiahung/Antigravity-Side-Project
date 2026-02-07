"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "./ThemeProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";

export function Navbar() {
    const t = useTranslations("nav");
    const { theme, toggleTheme } = useTheme();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const navItems = [
        { key: "about", href: "#about" },
        { key: "skills", href: "#skills" },
        { key: "experience", href: "#experience" },
        { key: "portfolio", href: "#portfolio" },
        { key: "contact", href: "#contact" },
    ] as const;

    const handleNavClick = () => setMobileOpen(false);

    return (
        <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
            <div className={`container ${styles.navInner}`}>
                <a href="#" className={styles.logo}>
                    C<span className={styles.logoAccent}>.</span>
                </a>

                <div className={styles.links}>
                    {navItems.map(({ key, href }) => (
                        <a
                            key={key}
                            href={href}
                            className={styles.link}
                            onClick={handleNavClick}
                        >
                            {t(key)}
                        </a>
                    ))}
                </div>

                <div className={styles.controls}>
                    <LanguageSwitcher />
                    <button
                        onClick={toggleTheme}
                        className={styles.iconBtn}
                        aria-label={theme === "dark" ? "Switch to light" : "Switch to dark"}
                    >
                        {theme === "dark" ? "☀" : "☾"}
                    </button>
                    <button
                        className={`${styles.iconBtn} ${styles.menuBtn}`}
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Menu"
                    >
                        {mobileOpen ? "✕" : "☰"}
                    </button>
                </div>
            </div>

            {mobileOpen && (
                <div className={styles.mobileMenu}>
                    {navItems.map(({ key, href }) => (
                        <a
                            key={key}
                            href={href}
                            className={styles.mobileLink}
                            onClick={handleNavClick}
                        >
                            {t(key)}
                        </a>
                    ))}
                </div>
            )}
        </nav>
    );
}
