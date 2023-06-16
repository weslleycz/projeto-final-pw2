import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export const config = {
    matcher: ["/","/registry"],
};

export async function middleware(req: NextRequest, res: NextApiResponse) {
    req.cookies.get("@token")
    return NextResponse.next();
}