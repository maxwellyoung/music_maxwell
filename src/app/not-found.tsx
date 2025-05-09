export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="mb-4 text-4xl font-bold tracking-tight">
        404 – Not Found
      </h1>
      <p className="mb-8 text-lg text-muted-foreground">
        Sorry, the page you&apos;re looking for doesn&apos;t exist.
      </p>
      <a
        href="/"
        className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground shadow transition hover:bg-accent"
      >
        Go Home
      </a>
    </div>
  );
}
