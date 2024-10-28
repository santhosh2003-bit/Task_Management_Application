// src/pages/api/tasks/index.js
import { pool } from "../../db";
import { Task } from "@/app/types/task";
export const GET = async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query("SELECT * FROM task");

    // console.log(rows);
    return Response.json(rows);
  } catch (error) {
    return Response.json({ error: "Failed to fetch tasks" });
  }
};
export const POST = async (req: Request, res: Response) => {
  const { title, recurrence, startDate, endDate }: Task = await req.json();
  try {
    const result = await pool.query(
      "INSERT INTO task (title, recurrence,startDate,endDate) VALUES ($1, $2,$3,$4) RETURNING *",
      [title, recurrence, startDate, endDate]
    );
    return Response.json(result.rows[0]);
  } catch (error) {
    return Response.json({ error: "Failed to create task" });
  }
};
