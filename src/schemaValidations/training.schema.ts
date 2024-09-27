import { z } from "zod";

export const trainingSchema = z.object({
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

export const trainingListResSchema = z.object({
    data: z.array(trainingSchema),
    message: z.string(),
    success: z.boolean(),
  });


export const trainingUserSchema = z.object({
    id: z.number(),
    group_training_id: z.number(),
    user_id: z.number(),
    status_request: z.string(),
    acconpanion: z.number(),
    note: z.string(),
    attendance: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    users: z.object({
        id: z.number(),
        name: z.string(),
        profile_photo_path: z.string()
    })
});

export const trainingUserListResSchema = z.object({
    data: z.array(trainingUserSchema),
    message: z.string(),
    success: z.boolean(),
});

export type TrainingUser = z.infer<typeof trainingUserSchema>;
export type TrainingUserList = Array<TrainingUser>;
export type TrainingUserListResType = z.infer<typeof trainingUserListResSchema>;

export type Training = z.infer<typeof trainingSchema>;
export type TrainingList = Array<Training>;
export type TrainingListResType = z.infer<typeof trainingListResSchema>;
