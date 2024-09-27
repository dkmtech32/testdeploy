import authApiRequest from '@/apiRequests/auth'
import { HttpError } from '@/lib/http'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const res = await request.json()
  const force = res.force as boolean | undefined

  const headers = new Headers()

  // Set cookies to expire immediately
  const expiredSessionTokenCookie = 'sessionToken=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax; Secure'
  const expiredRoleCookie = 'role=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax; Secure'

  // Append each expired cookie to the headers
  headers.append('Set-Cookie', expiredSessionTokenCookie)
  headers.append('Set-Cookie', expiredRoleCookie)

  if (force) {
    return Response.json(
      {
        message: 'Buộc đăng xuất thành công'
      },
      {
        status: 200,
        headers: headers
      }
    )
  }
  const cookieStore = cookies()
  const sessionToken = cookieStore.get('sessionToken')
  if (!sessionToken) {
    return Response.json(
      { message: 'Không nhận được session token' },
      {
        status: 401
      }
    )
  }
  try {
    const result = await authApiRequest.logoutFromNextServerToServer(
      sessionToken.value
    )
    return Response.json(result.payload, {
      status: 200,
      headers: headers
    })
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status
      })
    } else {
      return Response.json(
        {
          message: 'Lỗi không xác định'
        },
        {
          status: 500
        }
      )
    }
  }
}
