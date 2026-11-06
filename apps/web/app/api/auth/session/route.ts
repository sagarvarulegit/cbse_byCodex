import { NextResponse } from 'next/server';
import { getStudentSession } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getStudentSession();
  return NextResponse.json({ session });
}
