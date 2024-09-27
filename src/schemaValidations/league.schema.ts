import z from "zod";

export const CreateLeagueBody = z.object({
  name: z.string().min(1).max(256),
  money: z.coerce.number().positive(),
  images: z.string().url(),
  start_date: z.string().date(),
  end_date: z.string().date(),
  end_date_register: z.string().date(),
  format_of_league: z.string(),
  type_of_league: z.string(),
  number_of_athletes: z.number(),
  location: z.string(),
  start_time: z.string().time(),
});

export type CreateLeagueBodyType = {
  name: string;
  start_date: string;
  end_date: string;
  end_date_register: string;
  // format_of_league: "league-single-limination" | "league-round";
  // type_of_league:
  //   | "male-singles"
  //   | "female-singles"
  //   | "male-doubles"
  //   | "female-doubles"
  //   | "mixed";
  format_of_league: string;
  type_of_league: string;
  start_time: string;
  money: number;
  location: string;
  number_of_athletes: number;
  images: File | null;
};

export const LeagueSchema = z.object({
  id: z.number(),
  name: z.string(),
  money: z.number(),
  images: z.string(),
  start_date: z.string().date(),
  end_date: z.string().date(),
  end_date_register: z.string().date(),
  format_of_league: z.string(),
  type_of_league: z.string(),
  number_of_athletes: z.number(),
  image_background: z.string().nullable(),
  start_time: z.string().time(),
  national: z.string().nullable(),
  image_nation_flag: z.string().nullable(),
  status: z.number(),
  owner_id: z.number(),
  location: z.string(),
  slug: z.string(),
  created_at: z.string().date(),
  updated_at: z.string().date(),
  player_number: z.number(),
  is_joined: z.boolean(),
  is_applied: z.boolean(),
  is_full: z.boolean(),
  user_leagues: z.array(z.object({
    id: z.number(),
    league_id: z.number(),
    user_id: z.number(),
    status: z.string(),
    created_at: z.string().date(),
    updated_at: z.string().date()
  }))
});

export const LeagueRes = z.object({
  data: LeagueSchema,
  message: z.string(),
  success: z.boolean(),
});

export type LeagueResType = z.TypeOf<typeof LeagueRes>;

export const LeagueResCurrentUser = z.object({
  data: z.array(
    z.object({
      registration: z.object({
        id: z.number(),
        league_id: z.number(),
        user_id: z.number(),
        status: z.string(),
        created_at: z.string().date(),
        updated_at: z.string().date(),
      }),
      league: LeagueSchema,
    }),
  ),
  message: z.string(),
});

export type LeagueResCurrentUserType = z.TypeOf<typeof LeagueResCurrentUser>;

export const LeagueListRes = z.object({
  data: z.array(LeagueSchema),
  message: z.string(),
});

export type LeagueListResType = z.TypeOf<typeof LeagueListRes>;

export const PlayerNumberRes = z.object({
  success: z.boolean(),
  data: z.array(z.object({
    league_id: z.number(),
    player_count: z.number()
  })),
  message: z.string()
});

export type PlayerNumberResType = z.TypeOf<typeof PlayerNumberRes>;

export type ActiveUserLeagueReqType = {
  ids: number[];
  status: "active" | "inactive";
};

export const ActiveUserLeagueRes = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type ActiveUserLeagueResType = z.TypeOf<typeof ActiveUserLeagueRes>;

export const UpdateLeagueBody = CreateLeagueBody;
export type UpdateLeagueBodyType = CreateLeagueBodyType;

export const LeagueParams = z.object({
  id: z.coerce.number(),
});
export type LeagueParamsType = z.TypeOf<typeof LeagueParams>;
