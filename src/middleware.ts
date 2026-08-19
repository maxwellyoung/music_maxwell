import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(_req) {
    // Add any custom middleware logic here
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth/signin",
    },
  },
);

export const config = {
  matcher: ["/forum/:path*/edit", "/forum/:path*/delete"],
};
