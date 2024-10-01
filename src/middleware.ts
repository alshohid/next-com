import { NextRequest, NextResponse } from "next/server";
import { VerifyToken } from "./utility/jwtTokenhelper";

export async function middleware(req: NextRequest) {

  if (req.nextUrl.pathname.startsWith("/api/dashboard")) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { status: "fail", message: "Unauthorized: Token missing" },
        { status: 401 }
      );
    }

    try {
      const payload = await VerifyToken(token);

      if (!payload || !payload.email || !payload.id) {
        throw new Error("Invalid token payload");
      }
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("email", payload.email.toString());
      requestHeaders.set("id", payload.id.toString());
      return NextResponse.next({
        request: { headers: requestHeaders },
      });
    } catch (error) {
      return NextResponse.json(
        { status: "fail", message: "Unauthorized: Invalid or expired token" },
        { status: 401 }
      );
    }
  }


  if (req.nextUrl.pathname.startsWith("/api/user")) {
    return NextResponse.next();
  }


  return NextResponse.next();
}
