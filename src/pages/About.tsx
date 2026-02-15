const About = () => (
  <div className="py-16 lg:py-24">
    <div className="container max-w-3xl">
      <h1 className="font-heading text-4xl font-bold text-center">About MemoryLives</h1>
      <p className="mt-6 text-lg text-muted-foreground text-center">
        We believe every life deserves to be remembered beautifully.
      </p>

      <div className="mt-12 space-y-8 text-muted-foreground leading-relaxed">
        <div>
          <h2 className="font-heading text-2xl font-semibold text-foreground mb-3">Our Mission</h2>
          <p>
            MemoryLives was created to give families a dignified, permanent space on the internet to honor and celebrate the lives of those they've lost. In an age where digital presence matters, we believe memorial pages should be as thoughtful, warm, and enduring as the memories they preserve.
          </p>
        </div>

        <div>
          <h2 className="font-heading text-2xl font-semibold text-foreground mb-3">Our Values</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong className="text-foreground">Dignity</strong> — Every memorial is treated with the respect it deserves.</li>
            <li><strong className="text-foreground">Simplicity</strong> — Creating a memorial should be easy, even during difficult times.</li>
            <li><strong className="text-foreground">Permanence</strong> — Memories should last as long as the love behind them.</li>
            <li><strong className="text-foreground">Privacy</strong> — You control who sees what. Your data is yours.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-heading text-2xl font-semibold text-foreground mb-3">Our Story</h2>
          <p>
            MemoryLives started as a personal project born from the experience of losing a loved one and wanting a better way to share their story. What began as a simple page grew into a platform designed to help thousands of families preserve and share precious memories.
          </p>
          <p className="mt-3">
            We're committed to keeping MemoryLives accessible, beautiful, and trustworthy — a place where every life is honored.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default About;
