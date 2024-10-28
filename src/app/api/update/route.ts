// src/pages/api/tasks/[id].js
import { pool } from "../../db";
import { Task } from "@/app/types/task";
export const PUT = async (req: Request, res: Response) => {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const id = searchParams.get("id");

  const { title, recurrence, startDate, endDate }: Task = await req.json();
  try {
    const result = await pool.query(
      "UPDATE task SET title=$1, recurrence=$2, startDate=$3,endDate=$4 WHERE id=$5 RETURNING *",
      [title, recurrence, startDate, endDate, id]
    );
    return Response.json(result.rows[0]);
  } catch (error) {
    return Response.json({ error: "Failed to update task" });
  }
};

export const DELETE = async (req: Request, res: Response) => {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const id = searchParams.get("id");
  try {
    await pool.query("DELETE FROM task WHERE id=$1", [id]);
    return Response.json({ message: "Task deleted successfully" });
  } catch (error) {
    return Response.json({ error: "Failed to delete task" });
  }
};
export const GET = async (req: Request, res: Response) => {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const id = searchParams.get("id");
  try {
    const result = await pool.query("SELECT * FROM task WHERE id =$1", [id]);
    return Response.json(result.rows[0]);
  } catch (error) {
    return Response.json({ error: "Failed to get task" });
  }
};
