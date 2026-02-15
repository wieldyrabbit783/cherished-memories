const Privacy = () => (
  <div className="py-16 lg:py-24">
    <div className="container max-w-3xl prose prose-neutral">
      <h1 className="font-heading text-4xl font-bold text-center text-foreground">Privacy Policy</h1>
      <p className="text-center text-muted-foreground mt-2">Last updated: February 2026</p>

      <div className="mt-10 space-y-6 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground">1. Information We Collect</h2>
          <p>When you create an account, we collect your name, email address, and password. When you create a memorial, we collect the information you provide including names, dates, biographies, photos, and other content you choose to include.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
          <p>We use your information to provide and improve our services, including creating and displaying memorial pages, managing your account, and communicating with you about your account or our services.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground">3. Data Storage & Security</h2>
          <p>Your data is stored securely using industry-standard encryption and security practices. We use Supabase as our backend provider, which provides enterprise-grade security for data storage and authentication.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground">4. Your Rights</h2>
          <p>You have the right to access, update, or delete your personal data at any time through your account settings. You may also request a full export of your data by contacting us.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground">5. Cookies</h2>
          <p>We use essential cookies for authentication and session management. We do not use advertising or tracking cookies.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground">6. Third-Party Services</h2>
          <p>We may use third-party services for analytics and infrastructure. These services have their own privacy policies governing how they use your data.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground">7. Contact</h2>
          <p>If you have questions about this privacy policy, please contact us at <strong className="text-foreground">privacy@memorylives.com</strong>.</p>
        </section>
      </div>
    </div>
  </div>
);

export default Privacy;
