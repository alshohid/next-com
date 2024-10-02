import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        const headerList = headers()
        const id = parseInt(headerList.get("id") as any);
        const prisma = new PrismaClient()
        const reqbody = await req.json()
        reqbody.user_id=id;
        let result = await prisma.product_carts.create({
            data:reqbody
        })
        return (NextResponse.json({status:"success",data:result}))
    } catch (error) {
        return NextResponse.json({ status: "fail", data: error });
    }
}