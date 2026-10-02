import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <h1 className="text-4xl font-bold tracking-tight mb-4">Terms &amp; Conditions</h1>
        <p className="text-muted-foreground text-sm mb-10">Last updated: August 18, 2026</p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Texa, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Service Description</h2>
            <p>
              Texa is an AI-powered travel assistant that helps users plan trips, discover destinations, find hotels, restaurants, car rentals, and activities across Algeria. Our platform provides personalized recommendations based on user preferences.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. User Responsibilities</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate and complete information when using our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Bookings &amp; Third-Party Services</h2>
            <p>
              Texa facilitates bookings through third-party providers. We act as an intermediary and are not responsible for the quality, safety, or availability of services provided by third parties. Booking confirmations are subject to provider availability.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Intellectual Property</h2>
            <p>
              All content, features, and functionality of Texa — including but not limited to text, graphics, logos, icons, images, data compilations, and software — are the property of Texa and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Limitation of Liability</h2>
            <p>
              Texa shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services. Our total liability shall not exceed the amount paid by you, if any, for using our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Modifications</h2>
            <p>
              We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting. Your continued use of Texa following any changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Contact</h2>
            <p>
              For questions about these Terms, please contact us at <span className="text-foreground font-medium">texa@gmail.com</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
