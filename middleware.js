import { NextResponse } from "next/server";

export function middleware(request) {
  // Map the colon URL to the underscore URL internally
  if (request.nextUrl.pathname.includes("/gemini-1.5-pro:generateContent")) {
    const newUrl = request.nextUrl.clone();
    newUrl.pathname = newUrl.pathname.replace(
      ":generateContent",
      "_generateContent"
    );
    return NextResponse.rewrite(newUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/llm/google/v1beta/models/:path*"
};
