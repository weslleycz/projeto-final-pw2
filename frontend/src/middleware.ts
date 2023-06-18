import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/", "/registry"],
};

export async function middleware(req: NextRequest, res: NextApiResponse) {
  const token = req.cookies.get("token");
  switch (req.nextUrl.pathname) {
    case "/":
      if (!!token?.value) {
        return NextResponse.rewrite(new URL("/feed", req.url));
      } else {
        return NextResponse.next();
      }
    case "/registry":
        if (!!token?.value) {
          return NextResponse.rewrite(new URL("/feed", req.url));
        } else {
          return NextResponse.next();
        }
    default:
      return NextResponse.next();
  }
}
