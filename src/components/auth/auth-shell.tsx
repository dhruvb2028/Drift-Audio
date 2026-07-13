import { Logo } from "@/components/layout/logo";

/** Centered, on-brand frame around Clerk's sign-in / sign-up widgets. */
export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-[calc(100vh-9rem)] items-center justify-center overflow-hidden px-4 py-14">
      {/* Ambient brand glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-brand/15 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-radial-glow opacity-40" />

      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo />
          <h1 className="mt-6 font-display text-3xl font-bold text-white sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 max-w-xs text-sm text-white/55">{subtitle}</p>
        </div>
        <div className="flex justify-center">{children}</div>
      </div>
    </div>
  );
}
