import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const headerList = headers();
    const user_id = parseInt(headerList.get("id") as any);
    const prisma = new PrismaClient();
    let result = await prisma.product_wishes.findMany({
    where:{user_id:user_id},
    include:{products:true}
    });
    return NextResponse.json({ status: "success", data: result });
  } catch (error) {
    return NextResponse.json({ status: "fail", data: error });
  }
}
