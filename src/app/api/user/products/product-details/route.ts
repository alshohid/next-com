import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const product_id = parseInt(searchParams.get("id") as any);
    const prisma = new PrismaClient();
    let result = await prisma.products.findUnique({
    where:{id:product_id},
    include:{product_details:true}
    });
    return NextResponse.json({ status: "success", data: result });
  } catch (error) {
    return NextResponse.json({ status: "fail", data: error });
  }
}
