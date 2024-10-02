import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: Response) {
  try {

    const {searchParams}= new URL(req.url)
    const tran_id = parseInt(searchParams.get("tran_id") as any);
    const prisma = new PrismaClient();

    let result = await prisma.invoices.updateMany({
      where: {
        AND: [{ tran_id: tran_id as any}],
      },
      data:{payment_status:"success"}
    });

    return NextResponse.json({ status: "success", data: result });
  } catch (error: any) {
    return NextResponse.json({ status: "fail", data: error });
  }
}
