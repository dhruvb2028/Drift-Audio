import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Only run Clerk's middleware when auth is configured; otherwise pass through
// so the site works with no Clerk keys.
const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Pages that require a signed-in user. Unauthenticated visitors are redirected
// to sign-in by Clerk at the edge — before any page code runs, so it cannot be
// bypassed from the client. API routes enforce auth inside their own handlers
// (returning clean JSON 401s), so they're intentionally not listed here.
const isProtectedRoute = createRouteMatcher([
  "/account(.*)",
  "/checkout(.*)",
]);

export default hasClerk
  ? clerkMiddleware(
      async (auth, req) => {
        if (isProtectedRoute(req)) {
          // Redirect signed-out visitors to our own branded /sign-in page
          // (with a return path), instead of Clerk's hosted portal.
          await auth.protect({
            unauthenticatedUrl: new URL("/sign-in", req.url).toString(),
          });
        }
      },
      { signInUrl: "/sign-in", signUpUrl: "/sign-up" }
    )
  : function middleware() {
      return NextResponse.next();
    };

export const config = {
  matcher: [
    // Skip Next internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpg|jpeg|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes and Clerk's auto-proxy
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
