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

const FOCUS_VIDEOS = [
  `${BASE_PATH}/focus.mp4`,
  `${BASE_PATH}/focus2.mp4`,
  `${BASE_PATH}/focus3.mp4`,
  `${BASE_PATH}/focus4.mp4`,
  `${BASE_PATH}/focus5.mp4`,
  `${BASE_PATH}/focus6.mp4`,
  `${BASE_PATH}/focus7.mp4`,
  `${BASE_PATH}/focus8.mp4`,
];

const getFocusVideoOrder = (video: string): number => {
  const fileName = video.split("/").pop() ?? "";
  const match = fileName.match(/^focus(\d*)\.mp4$/);

  if (!match) {
    return 0;
  }

  const suffix = match[1];

  if (!suffix) {
    return 1;
  }

  const parsed = Number(suffix);

  if (Number.isNaN(parsed)) {
    return 0;
  }

  return parsed;
};

const SORTED_FOCUS_VIDEOS = [...FOCUS_VIDEOS].sort(
  (first, second) => getFocusVideoOrder(second) - getFocusVideoOrder(first),
);

const pickFocusVideo = (previousVideo: string | null) => {
  if (SORTED_FOCUS_VIDEOS.length === 1) {
    return SORTED_FOCUS_VIDEOS[0];
  }

  if (!previousVideo) {
    return SORTED_FOCUS_VIDEOS[0];
  }

  const previousIndex = SORTED_FOCUS_VIDEOS.indexOf(previousVideo);

  if (previousIndex === -1) {
    return SORTED_FOCUS_VIDEOS[0];
  }

  const nextIndex = (previousIndex + 1) % SORTED_FOCUS_VIDEOS.length;

  return SORTED_FOCUS_VIDEOS[nextIndex];
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
            ? pickFocusVideo(previousState.lastFocusVideo)
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
