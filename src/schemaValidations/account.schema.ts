import { Phone } from "lucide-react";
import z from "zod";

export const AccountRes = z
  .object({
    data: z.object({
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
    message: z.string(),
  })
  .strict();
export type AccountType = z.TypeOf<typeof AccountRes>["data"];

export const UserListRes = z
  .object({
    users: z.array(z.object({
      id: z.number(),
      avatar: z.string(),
      email: z.string(),
      name: z.string(),
      role: z.string(),
      title: z.string(),
      phone: z.string(),
      address: z.string(),
      sex: z.string(),
      status: z.boolean(),
      createdAt: z.string(),
      updatedAt: z.string(),
    })),
    message: z.string(),
  })
  .strict();
export type UserListType = z.TypeOf<typeof UserListRes>;

export type AccountResType = z.TypeOf<typeof AccountRes>;

export const UpdateMeBody = z.object({
  name: z.string().trim().min(2).max(256),
  // email: z.string().email(),
  phone: z.string().min(10).max(11),
  // address: z.string().trim().min(2).max(256),
});

export type UpdateMeBodyType = z.TypeOf<typeof UpdateMeBody>;
