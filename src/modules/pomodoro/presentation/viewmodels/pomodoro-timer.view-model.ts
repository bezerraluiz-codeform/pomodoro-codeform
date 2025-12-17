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
  `${BASE_PATH}/videos/focus.mp4`,
  `${BASE_PATH}/videos/focus2.mp4`,
  `${BASE_PATH}/videos/focus3.mp4`,
  `${BASE_PATH}/videos/focus4.mp4`,
  `${BASE_PATH}/videos/focus5.mp4`,
  `${BASE_PATH}/videos/focus6.mp4`,
  `${BASE_PATH}/videos/focus7.mp4`,
  `${BASE_PATH}/videos/focus8.mp4`,
];

const getFocusVideoOrder = (video: string): number => {
  const fileNamePart = video.split("/").pop();
  if (typeof fileNamePart !== "string") {
    return 0;
  }

  const fileName = fileNamePart;
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
          const parsedTasks: unknown = JSON.parse(savedTasks);
          const tasksWithDates = parseStoredTasks(parsedTasks);

          setState((prev) => ({ ...prev, tasks: tasksWithDates }));
        } catch {
          // Silenciosamente ignora tasks inválidas do localStorage
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

type StoredTask = Readonly<{
  id: string;
  title: string;
  assignee: string;
  isCompleted: boolean;
  createdAt: string;
}>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseStoredTask(value: unknown): Task {
  if (!isRecord(value)) {
    throw new Error("Task inválida no storage");
  }

  const id = value.id;
  const title = value.title;
  const assignee = value.assignee;
  const isCompleted = value.isCompleted;
  const createdAt = value.createdAt;

  const hasValidStrings =
    typeof id === "string" &&
    id.trim().length > 0 &&
    typeof title === "string" &&
    title.trim().length > 0 &&
    typeof assignee === "string" &&
    assignee.trim().length > 0 &&
    typeof createdAt === "string" &&
    createdAt.trim().length > 0;

  if (!hasValidStrings) {
    throw new Error("Task inválida no storage");
  }

  if (typeof isCompleted !== "boolean") {
    throw new Error("Task inválida no storage");
  }

  const createdAtDate = new Date(createdAt);
  if (Number.isNaN(createdAtDate.getTime())) {
    throw new Error("Task inválida no storage");
  }

  const storedTask: StoredTask = {
    id,
    title,
    assignee,
    isCompleted,
    createdAt,
  };

  return {
    id: storedTask.id,
    title: storedTask.title,
    assignee: storedTask.assignee,
    isCompleted: storedTask.isCompleted,
    createdAt: createdAtDate,
  };
}

function parseStoredTasks(value: unknown): Task[] {
  if (!Array.isArray(value)) {
    throw new Error("Lista de tasks inválida no storage");
  }

  return value.map((item) => parseStoredTask(item));
}
