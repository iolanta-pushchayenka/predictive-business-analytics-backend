import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email().max(255)), // в почте нет пробелов и в нижнем регистре
  password: z.string().min(8).max(128), // мин 8 символов и макс 128
});

export const registerSchema = credentialsSchema;
export const loginSchema = credentialsSchema;
