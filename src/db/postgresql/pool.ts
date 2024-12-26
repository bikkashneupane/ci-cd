import { Pool } from "pg";

const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "123456789",
  database: "postgres",
});

// Utility to execute queries
export const query = (text: string, values?: any[]) => {
  return pool.query(text, values);
};

export default pool;
