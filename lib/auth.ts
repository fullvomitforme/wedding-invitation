import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

// Better Auth requires a database for email/password. Set DATABASE_URL (e.g. Supabase connection string).
// Run `bunx @better-auth/cli migrate` to create user/session tables.
const pool = connectionString ? new Pool({ connectionString }) : undefined;

export const auth = betterAuth({
  database: pool,
  emailAndPassword: {
    enabled: true,
  },
  secret: process.env.BETTER_AUTH_SECRET,
  basePath: "/api/auth",
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [nextCookies()],
});
