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
  const formatDateForInput = (dateString: string) => {
    // console.log("Original Date String:", dateString); // Debug log
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.error("Invalid date string:", dateString);
      return ""; // Return empty string or handle error appropriately
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      alert("Start and end dates are required");
      return;
    }
    if (edit) {
      // console.log(edit);
      const response = await fetch(`/api/update?id=${edit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, recurrence, startDate, endDate }),
      });
      if (!response.ok) {
        alert("Failed to update task");
        return;
      }

      const updatedTask: Task = await response.json();
      alert("Task updated");
      // console.log(updatedTask);
      // Update the tasks list with the modified task
      setTasks(
        tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
      setEdit(null);
      setTitle("");
      setRecurrence("daily");
      setStartDate("");
      setEndDate("");
    } else {
      const response = await fetch("/api/task", {
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
      setTitle(edit.title);
      setRecurrence(edit.recurrence);
      setStartDate(formatDateForInput(edit.startdate)); // Format the start date
      setEndDate(formatDateForInput(edit.enddate)); // Format the end date
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
            <option value="yearly">15Days</option>
            <option value="yearly">5Days</option>
            <option value="yearly">10Days</option>
            <option value="yearly">20Days</option>
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
