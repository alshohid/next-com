import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  try {
    const headerList = headers();
    const userId = parseInt(headerList.get("id") as any);
    const prisma = new PrismaClient();
    const reqbody = await req.json();
    let result = await prisma.customer_profiles.upsert({
      where: { user_id: userId as any },
      update: reqbody,
      create: { ...reqbody, user_id: userId },
    });

    return NextResponse.json({ status: "success", data: result });
  } catch (error: any) {
    return NextResponse.json({ status: "fail", data: error });
  }
}
