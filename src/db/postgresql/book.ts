import express, { Request, Response } from "express";
import { query } from "./pool";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await query("SELECT * FROM products LIMIT 10");
    console.log(result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
