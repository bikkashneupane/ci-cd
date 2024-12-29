import express, { NextFunction, Request, Response } from "express";
import { getProducts } from "./models/products";

const router = express.Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page: number = Math.max(
      parseInt(req.query.page as string, 10) || 1,
      1
    );
    const limit: number = Math.max(
      parseInt(req.query.limit as string, 10) || 10,
      1
    );

    const { products } = await getProducts(page, limit);
    products?.length === 0
      ? next({ message: "Product Not Found", status: 404 })
      : res.json({ products, status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
