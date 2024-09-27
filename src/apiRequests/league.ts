import http from "@/lib/http";
import { MessageResType } from "@/schemaValidations/common.schema";
import {
  ActiveUserLeagueReqType,
  ActiveUserLeagueResType,
  CreateLeagueBodyType,
  LeagueListResType,
  LeagueResCurrentUserType,
  LeagueResType,
  PlayerNumberResType,
  UpdateLeagueBodyType,
} from "@/schemaValidations/league.schema";
import { UserLeagueResType } from "@/schemaValidations/user-league.schema";
import { register } from "module";

const leagueApiRequest = {
  getList: () => http.get<LeagueListResType>("/api/leagues"),
  getDashboardList: () => http.get<LeagueListResType>("/api/all-leagues"),
  getHomeList: () => http.get<LeagueListResType>("/api/feature-leagues"),
  getDetail: (id: number) =>
    http.get<LeagueResType>(`/api/league/${id}`, {
      cache: "no-store",
    }),
  getCurrentUserRegisterLeague: () =>
    http.get<LeagueResCurrentUserType>("/api/current-user-register-league"),
  getDetailSlug: (slug: string) =>
    http.get<LeagueResType>(`/api/league/${slug}`),
  getHomeLeagueDetail: (slug: string) =>
    http.get<LeagueResType>(`/api/leagues/${slug}`),
  getLeaguePlayer: (slug: string) =>
    http.get<UserLeagueResType>(`/api/league/${slug}/users-register`),

  getLeaguePlayerNumber: (slug: string) =>
    http.get<any>(`/api/league-player-number/${slug}`),
  getLeaguesPlayerNumber: () =>
    http.get<PlayerNumberResType>(`/api/leagues-player-number`),
  create: (body: FormData) => 
    http.post<LeagueResType>("/api/league", body),
  update: (id: number, body: FormData) =>
    http.post<LeagueResType>(`/api/league/update/${id}`, body),
  registerUser: (body: any) =>
    http.post<MessageResType>("/api/register-league", body),
  activeLeague: (id: any) =>
    http.get<MessageResType>(`/api/league/active/${id}`),
  activeUser: (body: ActiveUserLeagueReqType) =>
    http.post<ActiveUserLeagueResType>("/api/active-user-register-league", body),


  deleteUser: (id: number) =>
    http.get<MessageResType>(`api/delete-user-league/${id}`),
  uploadImage: (body: FormData) =>
    http.post<{
      message: string;
      data: string;
    }>("/media/upload", body),
  delete: (id: number) => http.delete<MessageResType>(`/api/league/${id}`),
};

export default leagueApiRequest;
