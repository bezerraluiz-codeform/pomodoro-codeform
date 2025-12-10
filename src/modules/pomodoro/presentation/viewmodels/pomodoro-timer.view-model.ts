import { useCallback, useEffect, useState } from "react";
import { Task } from "../../domain/entities/task.entity";

export type PomodoroMode = "focus" | "short-break" | "long-break";

export type PomodoroTimerStatus = "idle" | "running" | "paused";

export type PomodoroDurationMode = "long-break-15" | "long-break-30";

interface PomodoroTimerState {
  mode: PomodoroMode;
  status: PomodoroTimerStatus;
  remainingSeconds: number;
  completedFocusBlocks: number;
  tasks: Task[];
  isPlayingFocusVideo: boolean;
  currentFocusVideo: string | null;
  durationMode: PomodoroDurationMode;
  lastFocusVideo: string | null;
  focusVideos: string[];
}

const DURATIONS = {
  "long-break-15": {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  },
  "long-break-30": {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 30 * 60,
  },
};

const BASE_PATH =
  process.env.NODE_ENV === "production" ? "/pomodoro-codeform" : "";

const DEFAULT_FOCUS_VIDEOS = [`${BASE_PATH}/videos/focus.mp4`];

const buildFocusVideoUrl = (fileName: string) => `${BASE_PATH}/videos/${fileName}`;

const pickFocusVideo = (videos: string[], previousVideo: string | null) => {
  if (videos.length === 0) {
    return null;
  }

  // Primeiro ciclo sempre começa no vídeo mais recente (primeiro do array)
  if (!previousVideo) {
    return videos[0];
  }

  const currentIndex = videos.indexOf(previousVideo);

  if (currentIndex === -1) {
    return videos[0];
  }

  const nextIndex = (currentIndex + 1) % videos.length;

  return videos[nextIndex];
};

const createInitialState = (): PomodoroTimerState => ({
  mode: "focus",
  status: "idle",
  remainingSeconds: DURATIONS["long-break-15"].focus,
  completedFocusBlocks: 0,
  tasks: [],
  isPlayingFocusVideo: false,
  currentFocusVideo: null,
  durationMode: "long-break-15",
  lastFocusVideo: null,
  focusVideos: DEFAULT_FOCUS_VIDEOS,
});

export const usePomodoroTimerViewModel = () => {
  const [state, setState] = useState<PomodoroTimerState>(createInitialState);
  const [isAutoStartEnabled, setIsAutoStartEnabled] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTasks = localStorage.getItem("pomodoro-tasks");
      if (savedTasks) {
        try {
          const parsedTasks = JSON.parse(savedTasks);
          const tasksWithDates = parsedTasks.map((task: any) => ({
            ...task,
            createdAt: new Date(task.createdAt),
          }));

          setState((prev) => ({ ...prev, tasks: tasksWithDates }));
        } catch (error) {
          console.error("Erro ao carregar tasks do localStorage", error);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const loadFocusVideos = async () => {
      try {
        const response = await fetch("/api/focus-videos");

        if (!response.ok) {
          throw new Error("Falha ao buscar vídeos de foco");
        }

        const data: { files?: string[] } = await response.json();

        const videos =
          data.files && data.files.length > 0
            ? data.files.map((fileName) => buildFocusVideoUrl(fileName))
            : DEFAULT_FOCUS_VIDEOS;

        setState((previousState) => ({
          ...previousState,
          focusVideos: videos,
        }));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Erro ao carregar vídeos de foco", error);

        setState((previousState) => ({
          ...previousState,
          focusVideos: DEFAULT_FOCUS_VIDEOS,
        }));
      }
    };

    void loadFocusVideos();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pomodoro-tasks", JSON.stringify(state.tasks));
    }
  }, [state.tasks]);

  const getDuration = useCallback(
    (mode: PomodoroMode, durationMode: PomodoroDurationMode) => {
      const config = DURATIONS[durationMode];
      if (mode === "focus") return config.focus;
      if (mode === "short-break") return config.shortBreak;
      return config.longBreak;
    },
    [],
  );

  useEffect(() => {
    if (state.status !== "running") {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setState((previousState) => {
        if (previousState.status !== "running") {
          return previousState;
        }

        if (previousState.remainingSeconds === 0) {
          let nextMode: PomodoroMode = "focus";
          let nextCompletedFocusBlocks = previousState.completedFocusBlocks;

          if (previousState.mode === "focus") {
            nextCompletedFocusBlocks += 1;
            if (nextCompletedFocusBlocks % 4 === 0) {
              nextMode = "long-break";
            } else {
              nextMode = "short-break";
            }
          } else if (previousState.mode === "long-break") {
            nextMode = "focus";
            nextCompletedFocusBlocks = 0;
          } else {
            // short-break
            nextMode = "focus";
          }

          const nextDuration = getDuration(nextMode, previousState.durationMode);

          const shouldPlayVideo = previousState.mode === "focus";
          const nextFocusVideo = shouldPlayVideo
            ? pickFocusVideo(previousState.focusVideos, previousState.lastFocusVideo)
            : null;

          return {
            ...previousState,
            mode: nextMode,
            status: isAutoStartEnabled ? "running" : "idle",
            remainingSeconds: nextDuration,
            completedFocusBlocks: nextCompletedFocusBlocks,
            isPlayingFocusVideo: shouldPlayVideo,
            currentFocusVideo: nextFocusVideo,
            lastFocusVideo: shouldPlayVideo
              ? nextFocusVideo
              : previousState.lastFocusVideo,
          };
        }

        return {
          ...previousState,
          remainingSeconds: previousState.remainingSeconds - 1,
        };
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [state.status, isAutoStartEnabled]);

  const toggleAutoStart = useCallback(() => {
    setIsAutoStartEnabled((prev) => !prev);
  }, []);

  const toggleDurationMode = useCallback(() => {
    setState((prev) => {
      const nextDurationMode =
        prev.durationMode === "long-break-15" ? "long-break-30" : "long-break-15";
      const nextDuration = getDuration(prev.mode, nextDurationMode);

      return {
        ...prev,
        durationMode: nextDurationMode,
        // Se estiver idle, atualiza o tempo imediatamente para refletir a nova configuração
        remainingSeconds: prev.status === "idle" ? nextDuration : prev.remainingSeconds,
      };
    });
  }, [getDuration]);

  const handleStart = useCallback(() => {
    setState((previousState) => {
      if (previousState.status === "running") {
        return previousState;
      }

      let nextRemainingSeconds = previousState.remainingSeconds;

      if (previousState.remainingSeconds === 0) {
        nextRemainingSeconds = getDuration(
          previousState.mode,
          previousState.durationMode,
        );
      }

      return {
        ...previousState,
        status: "running",
        remainingSeconds: nextRemainingSeconds,
      };
    });
  }, []);

  const handlePause = useCallback(() => {
    setState((previousState) => {
      if (previousState.status !== "running") {
        return previousState;
      }

      return {
        ...previousState,
        status: "paused",
      };
    });
  }, []);

  const handleResume = useCallback(() => {
    setState((previousState) => {
      if (previousState.status !== "paused") {
        return previousState;
      }

      return {
        ...previousState,
        status: "running",
      };
    });
  }, []);

  const handleReset = useCallback(() => {
    setState((previousState) => {
      const duration = getDuration(
        previousState.mode,
        previousState.durationMode,
      );

      return {
        ...previousState,
        status: "idle",
        remainingSeconds: duration,
      };
    });
  }, [getDuration]);

  const handleSkip = useCallback(() => {
    setState((previousState) => {
      let nextMode: PomodoroMode = "focus";
      let nextCompletedFocusBlocks = previousState.completedFocusBlocks;

      if (previousState.mode === "focus") {
        nextCompletedFocusBlocks += 1;
        if (nextCompletedFocusBlocks % 4 === 0) {
          nextMode = "long-break";
        } else {
          nextMode = "short-break";
        }
      } else {
        nextMode = "focus";
        if (previousState.mode === "long-break") {
          nextCompletedFocusBlocks = 0;
        }
      }

      const nextDuration = getDuration(nextMode, previousState.durationMode);

      return {
        ...previousState,
        mode: nextMode,
        status: "idle",
        remainingSeconds: nextDuration,
        completedFocusBlocks: nextCompletedFocusBlocks,
      };
    });
  }, [getDuration]);

  const addTask = useCallback((title: string, assignee: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      assignee,
      isCompleted: false,
      createdAt: new Date(),
    };

    setState((prev) => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
    }));
  }, []);

  const toggleTaskCompletion = useCallback((taskId: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
      ),
    }));
  }, []);

  const removeTask = useCallback((taskId: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((task) => task.id !== taskId),
    }));
  }, []);

  const handleVideoEnded = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isPlayingFocusVideo: false,
      currentFocusVideo: null,
    }));
  }, []);

  const handlePrimaryActionClick = useCallback(() => {
    if (state.status === "running") {
      handlePause();
      return;
    }

    if (state.status === "paused") {
      handleResume();
      return;
    }

    handleStart();
  }, [state.status, handlePause, handleResume, handleStart]);

  const minutes = Math.floor(state.remainingSeconds / 60);
  const seconds = state.remainingSeconds % 60;

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds,
  ).padStart(2, "0")}`;

  const primaryActionLabel: "Start" | "Pause" | "Resume" =
    state.status === "running"
      ? "Pause"
      : state.status === "paused"
        ? "Resume"
        : "Start";

  return {
    formattedTime,
    mode: state.mode,
    primaryActionLabel,
    isAutoStartEnabled,
    handlePrimaryActionClick,
    handleReset,
    handleSkip,
    toggleAutoStart,
    tasks: state.tasks,
    addTask,
    toggleTaskCompletion,
    removeTask,
    isPlayingFocusVideo: state.isPlayingFocusVideo,
    currentFocusVideo: state.currentFocusVideo,
    durationMode: state.durationMode,
    handleVideoEnded,
    toggleDurationMode,
  };
};
