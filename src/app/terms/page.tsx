import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/layout/legal-page";
import { siteConfig } from "@/content/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms that apply when you use the Kotek app and website.",
};

const email = siteConfig.email;

export default function TermsPage() {
  return (
    <LegalPage eyebrow="Legal" title="Terms of Use" updated="6 October 2026">
      <p>
        These terms apply when you use the {siteConfig.name} iPhone app (the
        &ldquo;App&rdquo;) and the website at{" "}
        <a href={siteConfig.url}>{siteConfig.url.replace("https://", "")}</a> (the
        &ldquo;Website&rdquo;). By using either, you agree to them. If you
        don&rsquo;t agree, please don&rsquo;t use the App or the Website.
      </p>

      <h2 id="apple">The App Store</h2>
      <p>
        The App is distributed through Apple&rsquo;s App Store and TestFlight.
        Your licence to use it is granted under Apple&rsquo;s{" "}
        <a
          href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Licensed Application End User License Agreement
        </a>
        , and these terms add to it. Apple is not responsible for the App or
        for providing support for it; please{" "}
        <Link href="/support">contact us</Link> instead.
      </p>

      <h2 id="what-it-is">What {siteConfig.name} is, and isn&rsquo;t</h2>
      <p>
        {siteConfig.name} is a practice partner for learning kotekan on a real
        gangsa. It is designed to help you take a first step on your own, not to
        replace a teacher or a sekaa. Note detection depends on your
        instrument, room and setup, so it won&rsquo;t always be perfect, and
        scores are a guide to your progress rather than a judgement of your
        playing.
      </p>

      <h2 id="safety">Your setup and safety</h2>
      <p>
        The App works with your iPhone mounted above your instrument. You are
        responsible for using a stable stand or tripod, securing your device,
        and keeping the space around you clear while you play. We are not
        responsible for damage to your phone, your instrument or anything else
        caused by a fall, a stray mallet or an unstable mount.
      </p>

      <h2 id="acceptable-use">Using the App and Website fairly</h2>
      <p>You agree not to:</p>
      <ul>
        <li>
          copy, modify, reverse engineer or redistribute the App, except where
          the law allows it;
        </li>
        <li>
          use the Website&rsquo;s forms to send spam, abuse, or anything
          unlawful, or try to disrupt or overload the Website;
        </li>
        <li>
          post anything on the feedback wall that is hateful, harassing,
          misleading, or that includes someone else&rsquo;s personal
          information.
        </li>
      </ul>

      <h2 id="your-content">What you send us</h2>
      <p>
        Notes on the <Link href="/feedback">feedback wall</Link> are public. You
        keep ownership of what you write, and you give us permission to display
        it on the Website. We may edit out personal details, and we may remove
        any note at our discretion.
      </p>
      <p>
        If you send us ideas or suggestions, we may use them to improve{" "}
        {siteConfig.name} without owing you anything for them. We appreciate
        them all the same.
      </p>

      <h2 id="ip">Ownership</h2>
      <p>
        The App, the Website, and their design, code, artwork and practice
        patterns belong to the {siteConfig.name} team or to the people who
        licensed them to us. Gamelan and kotekan belong to the people of Bali;
        we present the patterns in the App with respect for the tradition and
        the musicians who shared them with us.
      </p>

      <h2 id="beta">Beta versions</h2>
      <p>
        Beta versions shared through TestFlight are unfinished. They may have
        bugs, change without notice, or stop working when the beta ends.
      </p>

      <h2 id="disclaimer">No warranty</h2>
      <p>
        The App and Website are provided &ldquo;as is&rdquo; and &ldquo;as
        available&rdquo;. To the extent the law allows, we make no promises
        that they will be error-free, uninterrupted, or suit a particular
        purpose.
      </p>

      <h2 id="liability">Limitation of liability</h2>
      <p>
        To the extent the law allows, we are not liable for any indirect,
        incidental or consequential loss arising from your use of the App or
        Website. Nothing in these terms limits any rights you have under
        consumer protection laws that cannot be excluded.
      </p>

      <h2 id="changes">Changes</h2>
      <p>
        We may update the App, the Website or these terms from time to time.
        When we change these terms, we will update the date at the top of this
        page. If you keep using {siteConfig.name} after a change, the new terms
        apply.
      </p>

      <h2 id="privacy">Privacy</h2>
      <p>
        How we handle data is explained in our{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h2 id="contact">Contact</h2>
      <p>
        Questions about these terms? Use the{" "}
        <Link href="/support">support form</Link> or email{" "}
        <a href={`mailto:${email}`}>{email}</a>.
      </p>
    </LegalPage>
  );
}
