import { Container } from "@/components/layout/Container";
import { HeroBackground } from "./HeroBackground";
import { HeroContent } from "./HeroContent";
import { CodePreview } from "./CodePreview";

export function Hero() {
  return (
    <section className="relative w-full pt-4 pb-16 sm:pb-24 overflow-hidden">
      <HeroBackground />
      <Container size="xl">
        <HeroContent />
        <div className="relative mt-2 sm:mt-6 z-10 px-2 sm:px-0">
          <CodePreview />
        </div>
      </Container>
    </section>
  );
}
