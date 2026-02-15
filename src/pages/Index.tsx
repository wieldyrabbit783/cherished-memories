import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Shield, Globe } from 'lucide-react';
import heroCandles from '@/assets/hero-candles.jpg';

const Index = () => (
  <div>
    {/* Hero */}
    <section className="relative overflow-hidden py-24 lg:py-36">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroCandles})` }}
      />
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <div className="container relative text-center">
        <h1 className="mx-auto max-w-3xl font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl animate-fade-in">
          Honor Their Memory,{' '}
          <span className="text-primary">Forever</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground animate-fade-in" style={{ animationDelay: '0.15s' }}>
          Create a beautiful, permanent memorial page for your loved one. Share their story, photos, and legacy with the world.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Button size="lg" asChild className="px-8 text-base">
            <Link to="/signup">Create a Memorial</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="px-8 text-base">
            <Link to="/about">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>

    {/* How it works */}
    <section className="py-20">
      <div className="container">
        <h2 className="text-center font-heading text-3xl font-semibold">How It Works</h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-muted-foreground">
          Creating a memorial is simple and meaningful.
        </p>
        <div className="mt-14 grid gap-10 sm:grid-cols-3">
          {[
            { step: '1', title: 'Sign Up', desc: 'Create your free account in seconds.' },
            { step: '2', title: 'Build the Memorial', desc: 'Add photos, biography, dates, and a tribute message.' },
            { step: '3', title: 'Share the Link', desc: 'Share the permanent memorial page with family and friends.' },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground font-heading text-xl font-bold">
                {item.step}
              </div>
              <h3 className="mt-5 font-heading text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Values */}
    <section className="bg-secondary/40 py-20">
      <div className="container">
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            { icon: Heart, title: 'Made with Care', desc: 'Every detail is designed to honor your loved one with warmth and dignity.' },
            { icon: Shield, title: 'Secure & Private', desc: 'Your data is protected. Only you manage your memorials.' },
            { icon: Globe, title: 'Shareable Forever', desc: 'A permanent link anyone can visit to remember and celebrate a life.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl bg-card p-8 shadow-sm text-center" style={{ boxShadow: 'var(--shadow-soft)' }}>
              <Icon className="mx-auto h-8 w-8 text-primary" />
              <h3 className="mt-4 font-heading text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Store CTA */}
    <section className="py-20">
      <div className="container text-center">
        <h2 className="font-heading text-3xl font-semibold">Keep Their Memory Close</h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          Turn cherished photos into beautiful keepsakes — T-shirts, mugs, framed prints, and more.
        </p>
        <Button size="lg" variant="outline" asChild className="mt-8 px-10 text-base">
          <Link to="/store">Shop Memorial Keepsakes</Link>
        </Button>
      </div>
    </section>

    {/* CTA */}
    <section className="py-20">
      <div className="container text-center">
        <h2 className="font-heading text-3xl font-semibold">Start Preserving Memories Today</h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          It only takes a few minutes to create a lasting tribute.
        </p>
        <Button size="lg" asChild className="mt-8 px-10 text-base">
          <Link to="/signup">Get Started — It's Free</Link>
        </Button>
      </div>
    </section>
  </div>
);

export default Index;
