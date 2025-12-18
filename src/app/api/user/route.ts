import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const token = searchParams.get('token');
  const idOwner = searchParams.get('id');
  const emailOwner = searchParams.get('email');

  if (!token || !emailOwner || !idOwner) {
    return NextResponse.json(
      { error: 'Token or id not found' },
      { status: 400 }
    );
  }

  const emailBase64 = btoa(emailOwner);
  const resUser = await fetch(
    `https://toko.tetrabit.my.id/api/users/${emailBase64}/email`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const userData = await resUser.json();

  if (!resUser.ok) {
    return NextResponse.json(resUser, { status: resUser.status });
  }

  const userWithBranch = await Promise.all(
    userData.data.map(async (v: any) => {
      const branchRes = await fetch(
        `https://toko.tetrabit.my.id/api/cabang/${idOwner}/get-by-owner`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const branch = await branchRes.json();

      const branchData = branch.data?.find((e: any) => e._id == v.cabangId);
      return {
        ...v,
        branch: branchData,
      };
    })
  );

  return NextResponse.json({ data: userWithBranch }, { status: 200 });
}