import z from "zod";
import { UserSchema } from "./user-league.schema";

export const CreateGroupBody = z.object({
  name: z.string().min(1).max(256),
  image: z.string().url(),
  number_of_members: z.number(),
  location: z.string(),
  note: z.string(),
  description: z.string(),
  status: z.string(),
});

export const GroupTrainingSchema = z.object({
  id: z.number(),
  group_id: z.number(),
  name: z.string(),
  members: z.number(),
  location: z.string(),
  description: z.string(),
  note: z.string(),
  owner_user: z.number(),
  date: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  number_of_courts: z.number().nullable(),
  payment: z.string().nullable(),
  member_count: z.number(),
  is_joined: z.boolean(),
  is_applied: z.boolean(),
});

export const GroupSchema = z.object({
  id: z.number(),
  name: z.string(),
  image: z.string(),
  number_of_members: z.number(),
  location: z.string(),
  note: z.string(),
  description: z.string(),
  status: z.string(),
  active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  group_owner: z.number(),
  member_count: z.number(),
  is_joined: z.boolean(),
  is_applied: z.boolean(),
  members: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      email: z.string(),
      phone: z.string(),
      profile_photo_path: z.string(),
      sex: z.string(),
      users: z.object({}),
    })
  ),
  training: z.array(GroupTrainingSchema),
});

export const GroupRes = z.object({
  data: GroupSchema,
  message: z.string(),
});

export const GroupResList = z.object({
  data: z.array(GroupSchema),
  message: z.string(),
});

export const GroupStatusRes = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const GroupTrainingRes = z.object({
  data: GroupTrainingSchema,
  message: z.string(),
});

export const GroupTrainingResList = z.object({
  data: z.array(GroupTrainingSchema),
  message: z.string(),
});

export const GetMemberCountRes = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.number(),
});
export const GroupHomeSchema = z.object({
  id: z.number(),
  name: z.string(),
  location: z.string(),
  description: z.string(),
  note: z.string(),
  status: z.string(),
  image: z.string(),
  group_owner: z.number(),
  is_joined: z.boolean(),
  is_applied: z.boolean(),
  active: z.boolean(),
  number_of_members: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  training: z.array(GroupTrainingSchema),
  members: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      email: z.string(),
      phone: z.string(),
      profile_photo_path: z.string(),
      sex: z.string(),
      users: z.object({}),
    })
  ),
});
export const GroupHomeRes = z.object({
  data: GroupHomeSchema,
  message: z.string(),
});

export const GroupMemberSchema = z.object({
  id: z.number(),
  group_id: z.number(),
  user_id: z.number(),
  status_request: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  users: UserSchema,
});

export const GroupMemberListRes = z.object({
  data: z.array(GroupMemberSchema),
  message: z.string(),
  success: z.boolean(),
});

export type GroupMembersResType = z.TypeOf<typeof GroupMemberListRes>;

export type GroupHomeResType = z.TypeOf<typeof GroupHomeRes>;
export type GroupResType = z.TypeOf<typeof GroupRes>;

export type GroupListResType = z.TypeOf<typeof GroupResList>;
export type GroupStatusResType = z.TypeOf<typeof GroupStatusRes>;
export type GetMemberCountResType = z.TypeOf<typeof GetMemberCountRes>;
export type GroupTrainingResType = z.TypeOf<typeof GroupTrainingRes>;
export type GroupTrainingListResType = z.TypeOf<typeof GroupTrainingResList>;

export type GroupType = z.TypeOf<typeof GroupSchema>;
export type CreateGroupBodyType = {
  name: string;
  image: File | null;
  number_of_members: number;
  location: string;
  note: string;
  description: string;
  status: string;
};
