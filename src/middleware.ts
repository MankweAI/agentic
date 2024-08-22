// import { authMiddleware } from "@clerk/nextjs";

// export default authMiddleware({
//   publicRoutes: ["/", "/auth(.*)", "/portal(.*)", "/images(.*)", "/blogs(.*)"],
//   ignoredRoutes: ["/chatbot", ],
// });

// export const config = {
//   matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
// };


import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/auth(.*)",
    "/portal(.*)",
    "/images(.*)",
    "/blogs(.*)",
    "/pricing(.*)",
    "/terms(.*)",
    
  ],
  ignoredRoutes: [
    "/chatbot",
    "/api/instantChats(.*)",
    "/api/conversations(.*)",
    "/api/chatbot(.*)",
  ], // Add this line
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

