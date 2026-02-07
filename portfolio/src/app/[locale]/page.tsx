import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Experience } from "@/components/Experience";
import { Portfolio } from "@/components/Portfolio";
import { Contact } from "@/components/Contact";

export default function Home() {
    return (
        <>
            <Hero />
            <About />
            <Skills />
            <Experience />
            <Portfolio />
            <Contact />
        </>
    );
}
