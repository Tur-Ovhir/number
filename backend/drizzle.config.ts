import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/database/schema.ts",
  dialect: "postgresql",
  out: "./drizzle",
  verbose: true,
  dbCredentials: {
    host: "ep-falling-base-a8djzhhd-pooler.eastus2.azure.neon.tech",
    user: "neonDb_owner",
    password: "npg_a5VBwUrMYQ7y",
    database: "neonDb",
    ssl: "require",
  },
});
