import { NextRequest, NextResponse } from 'next/server';
import chatApiRequest from '@/apiRequests/chat';

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  try {
    // Forward the message to Laravel backend
    const response = await chatApiRequest.sent({ message });

    return NextResponse.json({ status: 'Message sent!', response }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Message sending failed.' }, { status: 500 });
  }
}
