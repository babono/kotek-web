import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center">
      <Container className="flex flex-col items-center gap-5 py-32 text-center">
        <p className="text-sm font-semibold tracking-wider text-accent uppercase">
          404
        </p>
        <h1 className="text-3xl font-bold text-balance sm:text-4xl">
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
