// src/components/TaskForm.tsx
"use client";
import { useEffect, useState } from "react";
import useTaskStore from "../store/useTaskStore";
import { Task } from "../types/task";

export default function TaskForm() {
  const [title, setTitle] = useState("");
  const [recurrence, setRecurrence] = useState("daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { tasks, setTasks, edit, state, setEdit } = useTaskStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (edit) {
      const response = await fetch(
        `http://localhost:3000/api/update?id=${edit.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, recurrence, startDate, endDate }),
        }
      );
      if (!response.ok) {
        alert("Failed to update task");
        return;
      }

      const updatedTask: Task = await response.json();
      alert("Task updated");
      console.log(updatedTask);
      // Update the tasks list with the modified task
      setTasks(
        tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
    } else {
      const response = await fetch("http://localhost:3000/api/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, recurrence, startDate, endDate }),
      });

      if (!response.ok) {
        alert("Failed to create task");
        return;
      }

      const newTask: Task = await response.json(); // Specify Task type here
      alert("Task created");
      setTasks(tasks.concat(newTask));
      setTitle("");
      setRecurrence("daily");
      setStartDate("");
      setEndDate("");
    }
  };
  useEffect(() => {
    if (edit) {
      setTitle(edit?.title ?? "");
      setRecurrence(edit?.recurrence ?? "daily");
      setStartDate(edit?.startDate ?? "");
      setEndDate(edit?.endDate ?? "");
    }
  }, [edit]);

  return (
    <div className="flex flex-col gap-4 font-serif w-full">
      <h1 className="text-xl font-bold text-white text-center">Task Form</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 md:w-[28%]  w-[80%] m-auto "
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="px-2 py-1 rounded-lg outline-none w-full"
        />
        <div className="flex flex-col md:flex-row items-center gap-4 w-full">
          <select
            className="px-2 py-2 rounded-lg md:w-fit w-full"
            value={recurrence}
            onChange={(e) => setRecurrence(e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="15 Days">15Days</option>
            <option value="5 Days">5Days</option>
            <option value="10 Days">10Days</option>
            <option value="20 Days">20Days</option>
          </select>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-2 py-1 rounded-lg outline-none w-full"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-2 py-1 rounded-lg outline-none w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 w-fit self-center px-3 py-1 rounded-lg "
        >
          {edit ? "Save" : "Add Task"}
        </button>
      </form>
    </div>
  );
}
