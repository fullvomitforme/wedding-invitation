import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

// Better Auth requires a database for email/password. Set DATABASE_URL (e.g. Supabase connection string).
// Run `bunx @better-auth/cli migrate` to create user/session tables.
const pool = connectionString ? new Pool({ connectionString }) : undefined;

export const auth = betterAuth({
  database: pool,
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Normalize email to lowercase so sign-in and sign-up always match (avoids "cannot login with same email").
          const email = typeof user.email === "string" ? user.email.trim().toLowerCase() : "";
          return { data: { ...user, email } };
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  secret: process.env.BETTER_AUTH_SECRET,
  basePath: "/api/auth",
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.NODE_ENV === "development" ? "http://localhost:3000" : undefined),
  plugins: [nextCookies()],
});
