import * as z from "zod";

export const accountFormSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  contact: z
    .string()
    .min(10, { message: "Contact number must be at least 10 digits" })
    .regex(/^\d+$/, { message: "Contact must contain only numbers" }),
  institute: z.string().min(2, { message: "Institute name is required" }),
  dob: z.date().refine((date) => date <= new Date(), {
    message: "Date of birth must be in the past",
  }),
  gender: z.string().min(1, { message: "Please select a gender" }),
  bloodGroup: z.string().min(1, { message: "Please select a blood group" }),
  linkedin: z.string().optional(),
  instagram: z.string().optional(),
  profileImage: z.string().optional(),
});

export type AccountFormValues = z.infer<typeof accountFormSchema>;
