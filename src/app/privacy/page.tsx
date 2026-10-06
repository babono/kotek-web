import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/layout/legal-page";
import { siteConfig } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Kotek handles your data. The app processes camera and microphone input on your iPhone and does not collect or share personal data.",
};

const email = siteConfig.email;

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      updated="6 October 2026"
      summary={
        <>
          <p className="font-semibold text-foreground">The short version</p>
          <ul>
            <li>
              <strong>The Kotek app does not collect personal data.</strong> There
              are no accounts, no ads, no analytics and no tracking.
            </li>
            <li>
              The camera and microphone are used <strong>live, on your iPhone</strong>
              , to see your instrument and hear which key you struck. Nothing is
              recorded or sent anywhere.
            </li>
            <li>
              Your key alignment and pitch calibration are saved only on your
              device, and are removed when you delete the app.
            </li>
            <li>
              On this website, we only keep what you choose to send us through
              the feedback wall or the support form.
            </li>
          </ul>
        </>
      }
    >
      <p>
        This policy explains how {siteConfig.name} (&ldquo;we&rdquo;,
        &ldquo;us&rdquo;) handles information when you use the {siteConfig.name}{" "}
        iPhone app (the &ldquo;App&rdquo;) and the website at{" "}
        <a href={siteConfig.url}>{siteConfig.url.replace("https://", "")}</a> (the
        &ldquo;Website&rdquo;). {siteConfig.name} is made by a small team at the
        Apple Developer Academy Bali.
      </p>

      <h2 id="app">The App</h2>

      <h3>Camera and microphone</h3>
      <p>
        {siteConfig.name} asks for access to your camera and microphone because
        that is how it works: the camera shows your gangsa so the App can
        highlight which key to play, and the microphone listens so it can tell
        which key you struck and when.
      </p>
      <p>
        Both are processed in real time on your iPhone. The App does not record
        video, does not save audio, and does not send camera or microphone data
        to us or to anyone else. You can turn either permission off at any time
        in <strong>Settings &rsaquo; Privacy &amp; Security</strong> on your
        iPhone, although the App can&rsquo;t guide you without them.
      </p>

      <h3>Data stored on your device</h3>
      <p>
        To work with your particular instrument, the App saves a small amount of
        setup information locally on your iPhone:
      </p>
      <ul>
        <li>
          <strong>Key alignment</strong>: where each key sits in the camera
          frame.
        </li>
        <li>
          <strong>Pitch calibration</strong>: if you use &ldquo;Record key
          pitches&rdquo;, the measured pitch of each key, stored as numbers. The
          strikes used to measure them are not kept as recordings.
        </li>
        <li>
          <strong>Preferences</strong>, such as tempo and audio cue settings.
        </li>
      </ul>
      <p>
        This information never leaves your device through the App. It may be
        included in your own iCloud or computer backups of your iPhone, which
        are handled by Apple under your Apple account settings. Deleting the
        App removes it.
      </p>

      <h3>No accounts, analytics or advertising</h3>
      <p>
        The App has no sign-in, does not contain advertising, does not use
        third-party analytics or tracking SDKs, and does not track you across
        other companies&rsquo; apps or websites.
      </p>

      <h3>Crash reports from Apple</h3>
      <p>
        If you have chosen in your iPhone settings to share analytics with app
        developers, Apple may send us anonymous crash reports and usage
        statistics through App Store Connect. These do not identify you, and
        you can turn this off in{" "}
        <strong>Settings &rsaquo; Privacy &amp; Security &rsaquo; Analytics &amp; Improvements</strong>.
      </p>

      <h3>TestFlight beta</h3>
      <p>
        If you install a beta version through Apple&rsquo;s TestFlight, Apple
        shares some information with us as part of that program, such as your
        name or email used to join, your device model, crash logs, and any
        feedback or screenshots you choose to send through TestFlight. This is
        handled under{" "}
        <a
          href="https://www.apple.com/legal/privacy/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Apple&rsquo;s privacy policy
        </a>
        , and we use it only to improve the beta.
      </p>

      <h2 id="website">The Website</h2>

      <h3>Feedback wall</h3>
      <p>
        When you post on the{" "}
        <Link href="/feedback">feedback wall</Link>, we store the note and the
        name you enter (if any). Notes are <strong>public</strong> and shown to
        other visitors, so please don&rsquo;t include anything personal.
      </p>

      <h3>Support form</h3>
      <p>
        When you use the <Link href="/support">support form</Link> or email us,
        we receive your email address, your message and any optional details
        you give us, such as your name and iPhone model. We use this only to
        answer you and to fix the problem you report.
      </p>

      <h3>Technical data</h3>
      <p>
        Like any website, our hosting provider processes your IP address and
        basic request information to deliver pages and protect the site. We
        also use your IP address briefly, in memory, to stop the same visitor
        submitting forms many times in a row. The Website does not use
        analytics, advertising cookies or tracking pixels.
      </p>

      <h2 id="processors">Who we share data with</h2>
      <p>
        We do not sell or rent personal data, and we do not share it for
        advertising. Messages from the Website are stored with service
        providers that work on our behalf:
      </p>
      <ul>
        <li>
          <strong>Notion</strong>, where feedback notes and support messages are
          stored.
        </li>
        <li>
          <strong>Our website hosting provider</strong>, which serves the Website.
        </li>
      </ul>
      <p>
        We may also disclose information if required by law.
      </p>

      <h2 id="retention">How long we keep it</h2>
      <p>
        Support messages are kept for as long as we need them to help you, and
        deleted within 24 months of the conversation ending. Feedback notes stay
        on the wall until we remove them or you ask us to. You can ask us to
        delete anything you have sent at any time.
      </p>

      <h2 id="rights">Your choices and rights</h2>
      <p>
        Depending on where you live, you may have the right to access, correct,
        or delete personal data we hold about you, or to object to how we use
        it. Because the App does not send us personal data, most requests will
        concern messages you sent through the Website. To make a request,{" "}
        <Link href="/support">contact us</Link> and choose &ldquo;Privacy or data
        request&rdquo;, or email <a href={`mailto:${email}`}>{email}</a>.
      </p>

      <h2 id="children">Children</h2>
      <p>
        The App is suitable for learners of all ages and collects no personal
        data from anyone. The Website&rsquo;s forms are not directed at
        children under 13. If you believe a child has sent us personal
        information, let us know and we will delete it.
      </p>

      <h2 id="changes">Changes to this policy</h2>
      <p>
        If we change how the App or Website handles data, we will update this
        page and the date at the top. If a change means the App starts
        collecting data it does not collect today, we will say so in the App
        before it happens.
      </p>

      <h2 id="contact">Contact</h2>
      <p>
        Questions about privacy? Use the <Link href="/support">support form</Link>{" "}
        or email <a href={`mailto:${email}`}>{email}</a>.
      </p>
    </LegalPage>
  );
}
