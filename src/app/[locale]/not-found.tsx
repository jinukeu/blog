import { Link } from '@/i18n/navigation';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
        <p className="text-muted-foreground mb-8">Page not found</p>
        <Link
          href="/"
          className="text-foreground underline underline-offset-4 hover:text-foreground/80 transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
