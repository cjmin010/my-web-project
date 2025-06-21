import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: '모든 필드를 입력해주세요.' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'MINI 스토어 <onboarding@resend.dev>', // Resend에서 승인한 'From' 주소여야 합니다.
      to: ['cjmin010@naver.com'],
      subject: `새 문의: ${name}`,
      html: `
        <p><strong>이름:</strong> ${name}</p>
        <p><strong>이메일:</strong> ${email}</p>
        <p><strong>메시지:</strong></p>
        <p>${message}</p>
      `,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: '메시지가 성공적으로 전송되었습니다.' }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 