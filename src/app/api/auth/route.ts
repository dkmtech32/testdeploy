export async function POST(request: Request) {
  const body = await request.json()
  const sessionToken = body.sessionToken as string
  const expiresAt = body.expiresAt as string
  const role = body.role as string

  if (!sessionToken) {
    return Response.json(
      { message: 'Không nhận được session token' },
      {
        status: 400
      }
    )
  }
  
  const expiresDate = new Date(expiresAt).toUTCString()

  // Create the cookie strings
  const sessionTokenCookie = `sessionToken=${sessionToken}; Path=/; HttpOnly; Expires=${expiresDate}; SameSite=Lax; Secure`
  const roleCookie = `role=${role}; Path=/; HttpOnly; Expires=${expiresDate}; SameSite=Lax; Secure`

  // Create a Headers object
  const headers = new Headers()

  // Append each cookie to the headers
  headers.append('Set-Cookie', sessionTokenCookie)
  headers.append('Set-Cookie', roleCookie)

  return Response.json(body, {
    status: 200,
    headers: headers
  })
}