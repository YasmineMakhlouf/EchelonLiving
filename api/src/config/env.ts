import dotenv from "dotenv";

dotenv.config();

const getRequiredEnv = (name: string): string => {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const getOptionalEnv = (name: string): string | undefined => {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    return undefined;
  }
  return value;
};

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 5000,
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",

  DB_HOST: getRequiredEnv("DB_HOST"),
  DB_PORT: Number(process.env.DB_PORT) || 5432,
  DB_NAME: getRequiredEnv("DB_NAME"),
  DB_USER: getRequiredEnv("DB_USER"),
  DB_PASSWORD: getRequiredEnv("DB_PASSWORD"),

  JWT_SECRET: getRequiredEnv("JWT_SECRET"),

  CLOUDINARY_CLOUD_NAME: getOptionalEnv("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_API_KEY: getOptionalEnv("CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: getOptionalEnv("CLOUDINARY_API_SECRET"),
} as const;
