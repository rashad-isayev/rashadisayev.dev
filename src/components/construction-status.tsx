type ConstructionStatusProps = {
  title: string;
  message: string;
};

export function ConstructionStatus({ title, message }: ConstructionStatusProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 text-center">
      <section className="layer-reveal layer-heading max-w-md">
        <p className="mb-3 text-sm font-medium text-muted">Under construction</p>
        <h1 className="text-4xl font-semibold tracking-normal text-balance sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 text-base leading-7 text-muted">{message}</p>
      </section>
    </main>
  );
}
