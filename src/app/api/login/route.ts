import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const credentials = Buffer.from(`${email}:${password}`).toString('base64');

  const response = await fetch(
    'https://toko.tetrabit.my.id/api/login',
    {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
