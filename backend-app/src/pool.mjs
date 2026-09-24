import pg from "pg";

export function createPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required");
  }
  return new pg.Pool({ connectionString, max: 10 });
}
