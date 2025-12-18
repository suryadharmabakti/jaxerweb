import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const token = searchParams.get('token');
  const idOwner = searchParams.get('id');

  if (!token || !idOwner) {
    return NextResponse.json(
      { error: 'Token or id not found' },
      { status: 400 }
    );
  }

  const response = await fetch(
    `https://toko.tetrabit.my.id/api/cabang/${idOwner}/get-by-owner`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

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
