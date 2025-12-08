"use client";

import Image from "next/image";
import { usePomodoroTimerViewModel } from "@/modules/pomodoro/presentation/viewmodels/pomodoro-timer.view-model";
import { PomodoroTodoList } from "../components/pomodoro-todo-list";

export const PomodoroHomeView = () => {
  const {
    formattedTime,
    mode,
    primaryActionLabel,
    handlePrimaryActionClick,
    handleReset,
    handleSkip,
    isAutoStartEnabled,
    toggleAutoStart,
    tasks,
    addTask,
    toggleTaskCompletion,
    removeTask,
    isPlayingFocusVideo,
    currentFocusVideo,
    handleVideoEnded,
    durationMode,
    toggleDurationMode,
  } = usePomodoroTimerViewModel();

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black text-slate-100">
      <div
        className={`absolute inset-0 transition-colors duration-700 ease-in-out ${
          mode === "focus"
            ? "bg-slate-900/20"
            : mode === "short-break"
              ? "bg-teal-900/20"
              : "bg-indigo-900/20"
        }`}
      />
      <main className="relative z-10 flex w-full max-w-6xl flex-col items-center justify-center px-4 py-8 md:px-6 md:py-12">
        <div className="flex w-full flex-col gap-12 lg:flex-row lg:items-stretch lg:justify-between">
          <aside className="w-full lg:w-[550px] lg:border-r lg:border-slate-800 lg:pr-12">
            <PomodoroTodoList
              tasks={tasks}
              onAdd={addTask}
              onToggle={toggleTaskCompletion}
              onRemove={removeTask}
            />
          </aside>

          <div className="flex flex-1 flex-col items-center gap-10 md:gap-12">
            <header className="flex flex-col items-center gap-4">
              <Image
                src={
                  process.env.NODE_ENV === "production"
                    ? "/pomodoro-codeform/codeform-logo.svg"
                    : "/codeform-logo.svg"
                }
                alt="Logo da CodeForm"
                width={96}
                height={96}
                priority
                className="h-20 w-20 md:h-24 md:w-24"
              />

              <p className="text-xl font-semibold tracking-[0.25em] text-slate-100 uppercase md:text-2xl">
                CodeForm
              </p>
            </header>

            <section
              aria-label="Área principal do cronômetro de foco e controles"
              className="flex w-full flex-col items-center gap-8 md:gap-10"
            >
              <div className="flex h-40 w-full max-w-sm flex-col items-center justify-center rounded-full border border-slate-700/70 bg-slate-900/40 shadow-[0_0_80px_rgba(15,23,42,0.7)] md:h-48 md:max-w-md">
                <span
                  className={`text-5xl font-bold tracking-[0.08em] tabular-nums md:text-6xl ${
                    mode === "focus"
                      ? "text-[#a9e6f7]"
                      : mode === "short-break"
                        ? "text-[#a9f2f7]"
                        : mode === "long-break"
                          ? "text-[#d3d3ff]"
                          : "text-slate-100"
                  }`}
                >
                  {formattedTime}
                </span>
                <span
                  className={`mt-2 text-lg font-medium uppercase tracking-widest md:text-xl ${
                    mode === "focus"
                      ? "text-[#a9e6f7]/80"
                      : mode === "short-break"
                        ? "text-[#a9f2f7]/80"
                        : mode === "long-break"
                          ? "text-[#d3d3ff]/80"
                          : "text-slate-100/80"
                  }`}
                >
                  {mode === "focus"
                    ? "Focus"
                    : mode === "short-break"
                      ? "Short Break"
                      : mode === "long-break"
                        ? "Long Break"
                        : ""}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={handlePrimaryActionClick}
                  aria-label={
                    primaryActionLabel === "Start"
                      ? "Iniciar cronômetro"
                      : primaryActionLabel === "Pause"
                        ? "Pausar cronômetro"
                        : "Retomar cronômetro"
                  }
                  className="min-w-[104px] rounded-full bg-slate-50 px-7 py-2.5 text-sm font-semibold tracking-wide text-slate-900 shadow-[0_0_30px_rgba(15,23,42,0.65)] transition-colors hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-100 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050815]"
                >
                  {primaryActionLabel}
                </button>

                <button
                  type="button"
                  onClick={handleSkip}
                  aria-label="Pular para o próximo período"
                  className="min-w-[104px] rounded-full border border-slate-600/80 bg-transparent px-7 py-2.5 text-sm font-medium tracking-wide text-slate-200 transition-colors hover:bg-slate-800/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-100 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050815]"
                >
                  Skip
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  aria-label="Reiniciar período atual"
                  className="min-w-[104px] rounded-full border border-slate-600/80 bg-transparent px-7 py-2.5 text-sm font-medium tracking-wide text-slate-200 transition-colors hover:bg-slate-800/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-100 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050815]"
                >
                  Reset
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={isAutoStartEnabled}
                  onClick={toggleAutoStart}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-100 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050815] ${
                    isAutoStartEnabled ? "bg-[#a9e6f7]" : "bg-slate-700"
                  }`}
                >
                  <span className="sr-only">Habilitar início automático</span>
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isAutoStartEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm font-medium text-slate-300">
                  Tempo contínuo
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={durationMode === "standard"}
                  onClick={toggleDurationMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-100 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050815] ${
                    durationMode === "standard"
                      ? "bg-[#a9e6f7]"
                      : "bg-slate-700"
                  }`}
                >
                  <span className="sr-only">Alternar duração do Pomodoro</span>
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      durationMode === "standard"
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm font-medium text-slate-300">
                  {durationMode === "standard" ? "30 min" : "20 min"}
                </span>
              </div>
            </section>
          </div>
        </div>
      </main>

      {isPlayingFocusVideo && currentFocusVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <video
            src={currentFocusVideo}
            autoPlay
            className="h-full w-full object-contain"
            onEnded={handleVideoEnded}
            controls={false}
            playsInline
            style={{ pointerEvents: "none" }}
          />
        </div>
      )}
    </div>
  );
};
