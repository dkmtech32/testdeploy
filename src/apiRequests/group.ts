import http from "@/lib/http";
import {
  CreateGroupBodyType,
  GetMemberCountResType,
  GroupHomeResType,
  GroupListResType,
  GroupMembersResType,
  GroupResType,
  GroupStatusResType,
  GroupTrainingListResType,
  GroupTrainingResType,
} from "@/schemaValidations/group.schema";
import { TrainingUserListResType } from "@/schemaValidations/training.schema";

const groupApiRequest = {
  //dashboard
  create: (body: FormData) => http.post<GroupStatusResType>("/api/group", body),
  update: (id: number, body: FormData) =>
    http.post<GroupStatusResType>(`/api/group/update/${id}`, body),
  getList: () => http.get<GroupListResType>("/api/group"),
  activeGroup: (id: number) =>
    http.get<GroupStatusResType>(`/api/group/active/${id}`),
  delete: (id: number) => http.delete<GroupStatusResType>(`/api/group/${id}`),
  getDetailId: (id: number) => http.get<GroupResType>(`/api/group/${id}`),
  getGroupMembers: (id: number) =>
    http.get<GroupMembersResType>(`/api/group/${id}/members`),
  activeUser: (body: any) => http.post<GroupStatusResType>(`/api/active-user-join-group`, body),
  deleteUser: (id: number) => http.delete<GroupStatusResType>(`/api/delete-user/${id}`),
  
  //training
  createGroupTraining: (body: FormData) =>
    http.post<GroupStatusResType>("/api/store-group-training", body),
  updateGroupTraining: (id: number, body: FormData) =>
    http.post<GroupStatusResType>(`/api/update-group-training/${id}`, body),
  getListGroupTraining: () =>
    http.get<GroupTrainingListResType>("/api/list-group-training"),
  deleteGroupTraining: (id: number) =>
    http.get<GroupStatusResType>(`/api/delete-group-training/${id}`),
  getDetailIdGroupTraining: (id: number) =>
    http.get<GroupTrainingResType>(`/api/show-group-training/${id}`),
  joinGroupTraining: (body: { group_training_id: string, acconpanion:number, note:string }) =>
    http.post<GroupStatusResType>(`/api/join-group-training`, body),
  getListGroupTrainingByGroup: (id: number) =>
    http.get<GroupTrainingListResType>(`/api/get-group-training/${id}`),
  getListUpcomingGroupTrainingByGroup: (id:number) =>
    http.get<GroupTrainingListResType>(`/api/get-upcoming-group-training/${id}`),
  getListPlayerGroupTraining: (id: number) =>
    http.get<TrainingUserListResType>(`/api/get-player-group-training/${id}`),
  

  //homepage
  getActiveFeatureGroup: () => http.get<GroupListResType>("/api/active-feature-group"),
  getLocation: () => http.get<GroupListResType>("/api/group/location"),
  getActiveGroupByLocation: (location: string) => http.get<GroupListResType>(`/api/group/location/active?location=${location}`),

  checkJoinGroup: (body: { group_id: number }) =>
    http.post<GroupStatusResType>(`/api/check-join-group`, body),
  checkFullGroup: (body: { group_id: number }) =>
    http.post<GroupStatusResType>(`/api/check-full-group`, body),
  getMemberCount: (body: { group_id: number }) =>
    http.post<GetMemberCountResType>(`/api/count-members-by-group-id`, body),
  joinGroup: (body: { group_id: number }) =>
    http.post<GroupStatusResType>(`/api/join-group`, body),
  getDetailGroup: (id: number) =>
    http.get<GroupHomeResType>(`/api/groups/${id}`),
  getMyGroup: () => http.get<GroupListResType>(`/api/my-group`),
};

export default groupApiRequest;
