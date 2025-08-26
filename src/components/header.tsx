import { Figma } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  return (
    <header className="py-8 text-center border-b relative">
      <div className="inline-flex items-center gap-3 mb-2">
        <Figma className="w-10 h-10 text-primary" />
        <h1 className="text-4xl font-bold tracking-tighter text-foreground sm:text-5xl font-headline">
          Figma2Code
        </h1>
      </div>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Paste your Figma design URL and let our AI generate clean HTML and CSS code for you.
      </p>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
    </header>
  );
}
