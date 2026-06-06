import { NextResponse } from "next/server";

// Clears the refresh token httpOnly cookie on logout.
export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("refresh_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0, // immediate expiry = delete
    path: "/",
  });
  return response;
}
