import http from '@/lib/http'

const chatApiRequest = {
  sent: (body: { message: string }) => http.post('/api/chat/sent', body),
  sentToNextServer: (body: { message: string }) => http.post('/api/chat/sent', body, { baseUrl: '' }),
  fetch: () => http.get('/api/chat/fetch')
}

export default chatApiRequest