import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  age: z.number().min(18),
  gender: z.string(),
  qualification: z.string(),
  courseChoice: z.string(),
});
