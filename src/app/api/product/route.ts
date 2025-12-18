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
    `https://toko.tetrabit.my.id/api/produk/${idOwner}/get-by-owner`,
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