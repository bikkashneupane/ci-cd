// CRUD functions using postgresql

import pool from "../pool";

interface IProduct {
  product_name: string;
  category_id: number;
  unit: number;
  price: number;
}

interface IProductRow {
  id: number;
  product_name: string;
  category_id: number;
  unit: number;
  price: number;
  created_at?: Date;
  updated_at?: Date;
}

// INSERT
export const insertBook = async ({
  product_name,
  category_id,
  unit,
  price,
}: IProduct): Promise<IProductRow> => {
  const query = `INSERT INTO products (product_name, category_id, unit, price) VALUES ($1, $2, $3, $4) RETURNING *`;

  const values = [product_name, category_id, unit, price];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// UPDATE

// DELETE
