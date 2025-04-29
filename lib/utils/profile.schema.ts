import { z } from "zod";

export const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),

  age: z
    .union([
      z.number().int().positive().max(120),
      z
        .string()
        .transform((val) => {
          const parsed = Number.parseInt(val);
          if (isNaN(parsed)) return undefined;
          return parsed;
        })
        .optional(),
      z.null(),
    ])
    .optional(),

  gender: z
    .enum(["male", "female", "other", "prefer-not-to-say"])
    .nullable()
    .optional(),

  qualification: z
    .enum(["high-school", "college", "professional", "other"])
    .nullable()
    .optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
