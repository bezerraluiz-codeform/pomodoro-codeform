import Image from "next/image";

export const PomodoroHomeView = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050815] text-slate-100">
      <main className="flex w-full max-w-3xl flex-col items-center justify-center px-6 py-12">
        <div className="flex flex-col items-center gap-12">
          <header className="flex flex-col items-center gap-4">
            <Image
              src="/codeform-logo.svg"
              alt="Logo da CodeForm"
              width={96}
              height={96}
              priority
            />

            <p className="text-2xl font-semibold tracking-[0.25em] text-slate-100 uppercase">
              CodeForm
            </p>
          </header>

          <section
            aria-label="Área principal do cronômetro de foco e controles"
            className="flex w-full flex-col items-center gap-10"
          >
            <div className="flex h-40 w-full max-w-md items-center justify-center rounded-full border border-slate-700/70 bg-slate-900/40 shadow-[0_0_80px_rgba(15,23,42,0.7)]">
              <span className="text-6xl font-bold tracking-[0.08em] tabular-nums">
                30:00
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                className="min-w-[104px] rounded-full bg-slate-50 px-7 py-2.5 text-sm font-semibold tracking-wide text-slate-900 shadow-[0_0_30px_rgba(15,23,42,0.65)] transition-colors hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-100/80"
              >
                Start
              </button>

              <button
                type="button"
                className="min-w-[104px] rounded-full border border-slate-600/80 bg-transparent px-7 py-2.5 text-sm font-medium tracking-wide text-slate-200 transition-colors hover:bg-slate-800/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60"
              >
                Pause
              </button>

              <button
                type="button"
                className="min-w-[104px] rounded-full border border-slate-600/80 bg-transparent px-7 py-2.5 text-sm font-medium tracking-wide text-slate-200 transition-colors hover:bg-slate-800/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60"
              >
                Reset
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};


