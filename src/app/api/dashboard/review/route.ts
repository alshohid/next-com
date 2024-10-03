import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const headerList = headers();
    const userIdHeader = headerList.get("id");

    if (!userIdHeader) {
      return NextResponse.json(
        { status: "fail", message: "User ID is missing" },
        { status: 400 }
      );
    }

    const userId = parseInt(userIdHeader);

    if (isNaN(userId)) {
      return NextResponse.json(
        { status: "fail", message: "Invalid user ID" },
        { status: 400 }
      );
    }

    const reqBody = await req.json();

    const customer = await prisma.customer_profiles.findUnique({
      where: { user_id: userId },
    });

    if (!customer) {
      return NextResponse.json(
        { status: "fail", message: "Customer not found" },
        { status: 404 }
      );
    }

    const result = await prisma.product_reviews.create({
      data: {
        ...reqBody,
        customer_id: customer.id,
      },
    });

    return NextResponse.json({ status: "success", data: result });
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { status: "fail", message: "An unexpected error occurred" },
      { status: 500 }
    );
  } 
}
