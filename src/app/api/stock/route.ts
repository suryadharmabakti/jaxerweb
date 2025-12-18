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

  const resStok = await fetch(
    `https://toko.tetrabit.my.id/api/stok-cabang/${idOwner}/get-by-owner/all/cabang`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const stokData = await resStok.json();

  if (!resStok.ok) {
    return NextResponse.json(stokData, { status: resStok.status });
  }

  const stokWithProduk = await Promise.all(
    stokData.data.map(async (v: any) => {
      const produkRes = await fetch(
        `https://toko.tetrabit.my.id/api/produk/${v.userId}/get-by-owner/${v.produkId}/id`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const produk = await produkRes.json();

      return {
        ...v,
        produk: produkRes.ok ? produk.data : null,
      };
    })
  );

  return NextResponse.json({ data: stokWithProduk }, { status: 200 });
}
