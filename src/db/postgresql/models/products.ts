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

// GET
export const getProducts = async (
  pageNumer: number,
  limit: number = 10
): Promise<{ products?: IProductRow[]; error?: string }> => {
  try {
    const offset = (pageNumer - 1) * limit;
    const query = `SELECT * FROM PRODUCTS LIMIT $1 OFFSET $2`;
    const values = [limit, offset];

    const response = await pool.query(query, values);
    return { products: response.rows };
  } catch (error) {
    console.error("Error fetching products: ", (error as Error).message);
    return { error: (error as Error).message };
  }
};

// INSERT
export const insertProduct = async ({
  product_name,
  category_id,
  unit,
  price,
}: IProduct): Promise<{ result?: IProductRow; error?: string }> => {
  try {
    const query = `INSERT INTO products (product_name, category_id, unit, price) VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [product_name, category_id, unit, price];

    const result = await pool.query(query, values);
    return { result: result.rows[0] };
  } catch (error) {
    console.error("Error inserting to table: ", (error as Error).message);
    return { error: (error as Error).message };
  }
};

// UPDATE

// DELETE
