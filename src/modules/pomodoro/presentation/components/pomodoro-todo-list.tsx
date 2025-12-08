import { useState } from "react";
import { Task } from "../../domain/entities/task.entity";

interface PomodoroTodoListProps {
  tasks: Task[];
  onAdd: (title: string) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export const PomodoroTodoList = ({
  tasks,
  onAdd,
  onToggle,
  onRemove,
}: PomodoroTodoListProps) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      onAdd(newTaskTitle.trim());
      setNewTaskTitle("");
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <h2 className="text-xl font-semibold tracking-wide text-slate-100 uppercase text-center md:text-left">
        Tasks do Dia
      </h2>
      
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Adicionar nova tarefa..."
          className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all"
        />
        <button
          type="submit"
          disabled={!newTaskTitle.trim()}
          className="bg-slate-100 text-slate-900 font-semibold px-4 py-2 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Add
        </button>
      </form>

      <ul className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="group flex items-center gap-3 bg-slate-900/30 border border-slate-800/50 rounded-lg p-3 transition-all hover:border-slate-700"
          >
            <input
              type="checkbox"
              checked={task.isCompleted}
              onChange={() => onToggle(task.id)}
              className="w-5 h-5 rounded border-slate-600 bg-slate-800/50 text-[#a9e6f7] focus:ring-offset-0 focus:ring-1 focus:ring-[#a9e6f7] cursor-pointer"
            />
            <span
              className={`flex-1 text-sm ${
                task.isCompleted
                  ? "text-slate-500 line-through"
                  : "text-slate-200"
              }`}
            >
              {task.title}
            </span>
            <button
              onClick={() => onRemove(task.id)}
              className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all px-2 cursor-pointer"
              aria-label="Remover tarefa"
            >
              ✕
            </button>
          </li>
        ))}
        {tasks.length === 0 && (
          <li className="text-slate-500 text-center text-sm py-4 italic">
            Nenhuma tarefa adicionada ainda.
          </li>
        )}
      </ul>
    </div>
  );
};

