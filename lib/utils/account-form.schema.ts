import * as z from "zod";

export const accountFormSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  contact: z
    .string()
    .min(10, { message: "Contact number must be at least 10 digits" }),
  institute: z.string().min(2, { message: "Institute name is required" }),
  dob: z
    .date({
      required_error: "Date of birth is required",
      invalid_type_error: "Date of birth must be a valid date",
    })
    .refine(
      (date) => {
        const today = new Date();
        const minDate = new Date(1900, 0, 1);
        return date <= today && date >= minDate;
      },
      {
        message: "Date of birth must be in the past and after 1900",
      }
    ),
  gender: z
    .string({
      required_error: "Please select a gender",
    })
    .min(1, { message: "Please select a gender" }),
  bloodGroup: z
    .string({
      required_error: "Please select a blood group",
    })
    .min(1, { message: "Please select a blood group" }),
  linkedin: z.string().optional(),
  instagram: z.string().optional(),
  profileImage: z.string().optional(),
});

export type AccountFormValues = z.infer<typeof accountFormSchema>;
