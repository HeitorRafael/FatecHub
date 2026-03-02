import "dotenv/config";
import { defineConfig } from "prisma/config";

let DATABASE_URL = process.env.DATABASE_URL;

// Se DATABASE_URL não estiver definida, construir a partir das variáveis individuais
if (!DATABASE_URL) {
  const dbUser = process.env.DB_USER || "postgres";
  const dbPassword = process.env.DB_PASSWORD || "senha123";
  const dbHost = process.env.DB_HOST || "localhost";
  const dbPort = process.env.DB_PORT || "5432";
  const dbName = process.env.DB_NAME || "fatechub";
  DATABASE_URL = `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?schema=public`;
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    provider: "postgresql",
    url: DATABASE_URL,
  },
});
