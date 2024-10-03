import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: Response) {
  try {
    const { searchParams } = new URL(req.url);
    const tran_id = searchParams.get("tran_id") as string;
    const prisma = new PrismaClient();

    let result = await prisma.invoices.updateMany({
      where: {
        AND: [{ tran_id: tran_id }],
      },
      data: { payment_status: "cancel" },
    });

    return NextResponse.json({ status: "success", data: result });
  } catch (error: any) {
    return NextResponse.json({ status: "fail", data: error });
  }
}
