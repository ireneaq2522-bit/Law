import { z } from "zod";

type TFunction = (key: string) => string;

export const SignUpSchema = (t: TFunction) => z.object({
  email: z.string().email({ message: t('validation.email.invalid') }),
  password: z
    .string()
    .min(6, { message: t('validation.password.tooShort', { min: 6 }) }),
});

export const SignInSchema = (t: TFunction) => z.object({
  email: z.string().email({ message: t('validation.email.invalid') }),
  password: z.string().min(1, { message: t('validation.password.required') }),
});

export const ComplaintSchema = (t: TFunction) => z.object({
  problem: z
    .string()
    .min(20, {
      message: t('validation.complaint.tooShort', { min: 20 }),
    })
    .max(5000, {
      message: t('validation.complaint.tooLong', { max: 5000 }),
    }),
  email: z.string().email({ message: t('validation.email.invalid') }).optional().or(z.literal('')),
});

export type SignUpInput = z.infer<ReturnType<typeof SignUpSchema>>;
export type SignInInput = z.infer<ReturnType<typeof SignInSchema>>;
export type ComplaintInput = z.infer<ReturnType<typeof ComplaintSchema>>;
