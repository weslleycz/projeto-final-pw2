import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export const config = {
    matcher: ["/","/registry"],
};

export async function middleware(request: NextRequest, res: NextApiResponse) {
    return NextResponse.next();
}