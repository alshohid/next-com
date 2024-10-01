import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get("id") as any);
    const prisma = new PrismaClient();
    let result = await prisma.product_reviews.findMany({
        where:{product_id:id},
        include:{customer_profiles:true,products:true,}
    });
    return NextResponse.json({ status: "success", data: result });
  } catch (error) {
    return NextResponse.json({ status: "fail", data: error });
  }
}
