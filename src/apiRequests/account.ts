import http from '@/lib/http'
import {
  AccountResType,
  UpdateMeBodyType,
  UserListType
} from '@/schemaValidations/account.schema'

const accountApiRequest = {
  me: () =>
    http.get<AccountResType>('api/account/me'),
  meClient: () => http.get<AccountResType>('account/me'),
  updateMe: (body: FormData) =>
    http.post<AccountResType>('api/account/me', body),
  getUserList: () => http.get<UserListType>('api/users'),
  deleteUser: (id: number) => http.delete<UserListType>(`api/account/user-list/${id}`),
  getUserDetail: (id: number) => http.get<UserListType>(`api/account/user-list/${id}`)
}


export default accountApiRequest