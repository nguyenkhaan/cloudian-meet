import Link from "next/link";

export default function MeetingEndedPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[var(--home-page)] p-6 text-[var(--home-text)] [color-scheme:light]">
      <div className="text-center">
        <h1 className="text-2xl font-medium sm:text-3xl">Your meeting has ended.</h1>
        <Link
          href="/"
          replace
          className="mt-6 inline-flex h-11 items-center rounded-full bg-[var(--meeting-control)] px-6 text-sm font-medium text-[var(--meeting-on-accent)] transition-colors hover:bg-[var(--meeting-control-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--home-focus-ring)] focus:ring-offset-2"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}
