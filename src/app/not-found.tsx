import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center">
      <Container className="flex flex-col items-center gap-5 py-32 text-center">
        <Image src="/art/kipli-sad.svg" alt="" width={84} height={72} className="h-20 w-auto" />
        <h1 className="text-heading leading-[0.9] text-balance sm:text-7xl">
          We couldn&rsquo;t find that page
        </h1>
        <p className="max-w-md text-muted-foreground text-pretty">
          The link may be out of date. Head back to the homepage to keep
          exploring Kotek.
        </p>
        <ButtonLink href="/" className="mt-2">
          Back to home
        </ButtonLink>
      </Container>
    </main>
  );
}
