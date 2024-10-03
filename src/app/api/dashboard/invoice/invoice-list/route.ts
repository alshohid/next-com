import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: Response) {
  try {
    const headerList = headers();
    const id = parseInt(headerList.get("id") as any);
    const prisma = new PrismaClient();

    let result = await prisma.invoices.findMany({
      where: {user_id:id},
    });

    return NextResponse.json({ status: "success", data: result });
  } catch (error: any) {
    return NextResponse.json({ status: "fail", data: error });
  }
}
