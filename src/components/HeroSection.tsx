interface HeroSectionProps {
  title?: string;
  subtitle?: string;
}

export function HeroSection({
  title = '이진욱의 기술 블로그',
  subtitle,
}: HeroSectionProps) {
  return (
    <section className="py-20 md:py-28 text-center animate-fade-in-up">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-foreground leading-tight">
        {title.split('\n').map((line, index) => (
          <span key={index}>
            {line}
            {index < title.split('\n').length - 1 && <br />}
          </span>
        ))}
      </h1>
      {subtitle && (
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      <div className="mt-10 w-20 h-px bg-foreground/20 mx-auto animate-pulse-soft-opacity" />
    </section>
  );
}
