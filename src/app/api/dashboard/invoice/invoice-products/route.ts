import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: Response) {
  try {
    const headerList = headers();
    const id = parseInt(headerList.get("id") as any);
    const prisma = new PrismaClient();
    const reqbody = await req.json();

    let result = await prisma.invoice_products.findMany({
      where: {
        AND: [{ user_id: id }, { invoice_id: reqbody.invoice_id }],
      },
      include: { products: true },
    });

    return NextResponse.json({ status: "success", data: result });
  } catch (error: any) {
    return NextResponse.json({ status: "fail", data: error });
  }
}
