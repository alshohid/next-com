import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: Response) {
  try {
    const headerList = headers();
    const userId = parseInt(headerList.get("id") as any);
    const prisma = new PrismaClient();

    let result = await prisma.customer_profiles.findUnique({
      where: { user_id: userId as any },

    });

    return NextResponse.json({ status: "success", data: result });
  } catch (error: any) {
    return NextResponse.json({ status: "fail", data: error });
  }
}
