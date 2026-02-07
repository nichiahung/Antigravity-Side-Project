import type { Metadata } from "next";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Outfit, Noto_Sans_TC, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-heading",
    display: "swap",
});

const notoSansTC = Noto_Sans_TC({
    subsets: ["latin"],
    variable: "--font-body",
    display: "swap",
    weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
    display: "swap",
});

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "metadata" });

    return {
        title: t("title"),
        description: t("description"),
        openGraph: {
            title: t("title"),
            description: t("description"),
            locale: locale === "zh-TW" ? "zh_TW" : "en_US",
            type: "website",
        },
    };
}

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const messages = (await import(`../../../messages/${locale}.json`)).default;

    return (
        <html
            lang={locale}
            className={`${outfit.variable} ${notoSansTC.variable} ${jetbrainsMono.variable}`}
            suppressHydrationWarning
        >
            <body>
                <ThemeProvider>
                    <NextIntlClientProvider locale={locale} messages={messages}>
                        <Navbar />
                        <main>{children}</main>
                        <Footer />
                    </NextIntlClientProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
