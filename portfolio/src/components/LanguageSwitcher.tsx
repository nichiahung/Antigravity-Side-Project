"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import styles from "./LanguageSwitcher.module.css";

export function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const switchLocale = () => {
        const next = locale === "zh-TW" ? "en" : "zh-TW";
        router.replace(pathname, { locale: next });
    };

    return (
        <button onClick={switchLocale} className={styles.btn} aria-label="Switch language">
            <span className={styles.label}>
                {locale === "zh-TW" ? "EN" : "中"}
            </span>
        </button>
    );
}
