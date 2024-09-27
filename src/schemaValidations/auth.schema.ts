import z from "zod";

export const RegisterBody = z
  .object({
    name: z.string().trim().min(2).max(256),
    email: z.string().email(),
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100),
    role: z.enum(["user", "admin"]),
    title: z.string().trim().min(2).max(256),
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Mật khẩu không khớp",
        path: ["confirmPassword"],
      });
    }
  });

export type RegisterBodyType = z.TypeOf<typeof RegisterBody>;

export const RegisterRes = z.object({
  data: z.object({
    access_token: z.string(),
    expires_at: z.string(),
    tokentype: z.string(),
    account: z.object({
      id: z.number(),
      avatar: z.string(),
      email: z.string(),
      name: z.string(),
      role: z.string(),
      title: z.string(),
      phone: z.string(),
      address: z.string(),
      sex: z.string(),
    }),
  }),
  message: z.string(),
});

export type RegisterResType = z.TypeOf<typeof RegisterRes>;

export const LoginBody = z
  .object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
  })
  .strict();

export type LoginBodyType = z.TypeOf<typeof LoginBody>;

export const LoginRes = z.object({
  access_token: z.string(),
  avatar: z.string(),
  email: z.string(),
  id: z.number(),
  name: z.string(),
  message: z.string(),
  role: z.string(),
  title: z.string(),
  token_type: z.string(),
  expires_at: z.string(),
  sex: z.string(),
});

export type LoginResType = z.TypeOf<typeof RegisterRes>;
export const SlideSessionBody = z.object({}).strict();

export type SlideSessionBodyType = z.TypeOf<typeof SlideSessionBody>;
export const SlideSessionRes = RegisterRes;

export type SlideSessionResType = z.TypeOf<typeof SlideSessionRes>;
