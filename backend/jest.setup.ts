// Runs before any module is imported — sqlite.ts reads this env var at module init time.
process.env.DATABASE_PATH = ":memory:";
