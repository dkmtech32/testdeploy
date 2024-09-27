import z from 'zod'

export type UserLeagueType = {
    id: number,
    league_id: number,
    user_id: number,
    status: 'active' | 'inactive',
    created_at: string,
    updated_at: string,
    user: UserType
}

export type UserType = {
    id: number,
    name: string,
    email: string,
    email_verified_at: null,
    current_team_id: null,
    profile_photo_path: string,
    role: string,
    phone: string | null,
    address: string | null,
    age: string | null,
    sex: string | null,
    deleted_at: null,
    title: string,
    google_id: null,
    facebook_id: null,
    apple_id: null,
    line_id: null,
    created_at: string,
    updated_at: string
}

export const UserSchema: z.ZodType<UserType> = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    email_verified_at: z.null(),
    current_team_id: z.null(),
    profile_photo_path: z.string(),
    role: z.string(),
    phone: z.string().nullable(),
    address: z.string().nullable(),
    age: z.string().nullable(),
    sex: z.string().nullable(),
    deleted_at: z.null(),
    title: z.string(),
    google_id: z.null(),
    facebook_id: z.null(),
    apple_id: z.null(),
    line_id: z.null(),
    created_at: z.string(),
    updated_at: z.string(),
})


export const UserLeagueSchema: z.ZodType<UserLeagueType> = z.object({
    id: z.number(),
    league_id: z.number(),
    user_id: z.number(),
    status: z.enum(['active', 'inactive']),
    created_at: z.string(),
    updated_at: z.string(),
    user: UserSchema
})

export const UserLeagueListRes = z.object({
  data: z.array(UserLeagueSchema),
  message: z.string()
})
export type UserLeagueResType = z.TypeOf<typeof UserLeagueListRes>