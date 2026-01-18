import z from "zod";

const passwordRequirements = z
  .string({
    error: "Password is required",
  })
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[\W_]/, {
    message: "Password must contain at least one special character",
  });

export const loginSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: passwordRequirements,
});

export const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits long" }),
  email: z.email({ message: "Invalid email address" }),
  password: passwordRequirements,
});
