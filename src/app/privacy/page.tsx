import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm mb-10">Last updated: August 18, 2026</p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
            <p>
              When you use Texa, we may collect personal information you provide directly, such as your name, email address, and travel preferences. We also collect usage data including pages visited, search queries, and interactions with our AI travel assistant to improve our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
            <p>
              We use your information to provide personalized travel recommendations, improve our AI models, communicate with you about your trips, and enhance the overall user experience. Your data helps us tailor hotel suggestions, restaurant recommendations, and activity options to your preferences.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Data Sharing</h2>
            <p>
              We do not sell your personal information. We may share anonymized and aggregated data with our travel partners (hotels, restaurants, car rental services) to facilitate bookings. Your personal identity is never disclosed without your explicit consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Data Security</h2>
            <p>
              We implement industry-standard encryption and security measures to protect your data. All communications are encrypted in transit, and we regularly audit our systems to ensure your information remains safe.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Your Rights</h2>
            <p>
              You have the right to access, modify, or delete your personal data at any time. You can manage your account settings through your profile page or contact us directly at texa@gmail.com for any data-related requests.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Cookies</h2>
            <p>
              Texa uses cookies to maintain your session, remember your preferences, and analyze usage patterns. You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. Continued use of Texa after changes constitutes acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at <span className="text-foreground font-medium">texa@gmail.com</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
