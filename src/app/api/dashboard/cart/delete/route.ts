import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const headerList = headers();
    const id = parseInt(headerList.get("id") as any);
    const reqbody = await req.json();
    const prisma = new PrismaClient();
    let result = await prisma.product_carts.deleteMany({
      where: {
        AND: [{ user_id: id }, { product_id: reqbody.product_id }],
      },
    });
    return NextResponse.json({ status: "success", data: result });
  } catch (error) {
    return NextResponse.json({ status: "fail", data: error });
  }
}
