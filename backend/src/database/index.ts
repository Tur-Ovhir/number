import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { neon } from "@neondatabase/serverless";

const sql = neon(
  "postgresql://neonDb_owner:npg_a5VBwUrMYQ7y@ep-falling-base-a8djzhhd-pooler.eastus2.azure.neon.tech/neonDb?sslmode=require"
);
const db = drizzle(sql, { schema });
export default db;
