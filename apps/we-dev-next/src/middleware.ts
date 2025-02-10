import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./utils/auth";
import { Messages } from "./app/api/chat/action";
import { createI18nMiddleware } from "fumadocs-core/i18n";
import { i18n } from "lib/i18n";
import acceptLanguage from "accept-language";
import { locales, Language } from "./utils/lang";

// 配置 accept-language
acceptLanguage.languages(locales);

// 常量定义
const DEFAULT_LANG = Language.English;
const DYNAMIC_LANG_COOKIE = "lang";

// 不需要验证的公开路径
const PUBLIC_PATHS = [
  "/api/auth/login",
  "/api/auth/github",
  "/api/auth/wechat",
  "/api/auth/github/callback",
  "/api/auth/register",
  "/api/auth/oauth",
  "/api/d2c",
  "/api/upload",
  "/api/chat",
  "/wedev",
] as const;

// CORS 配置
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  "Access-Control-Allow-Headers":
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
  "Access-Control-Allow-Credentials": "true",
} as const;

// 工具函数：添加 CORS 头
const addCorsHeaders = (response: NextResponse): NextResponse => {
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
};

// 工具函数：创建错误响应
const createErrorResponse = (message: string, status: number): NextResponse => {
  return addCorsHeaders(
    new NextResponse(JSON.stringify({ error: message }), {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    })
  );
};

export default createI18nMiddleware(i18n);

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 处理 CORS 预检请求
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: CORS_HEADERS,
    });
  }

  // 如果是 API 请求，进行权限验证
  if (pathname.startsWith("/api/")) {
    let token = request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      const cookieToken = request.cookies.get("token")?.value;
      if (cookieToken) {
        token = cookieToken;
      }
    }

    // 处理公开 API 路径
    if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
      if (pathname.startsWith("/api/chat")) {
        const { messages } = (await request.json()) as { messages: Messages };
        if (messages.length <= 10000 && !token) {
          return addCorsHeaders(NextResponse.next());
        }
      } else {
        return addCorsHeaders(NextResponse.next());
      }
    }

    // 验证 token
    if (!token) {
      return createErrorResponse("Authentication required", 401);
    }

    try {
      const decoded = await verifyToken(token);
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("userId", decoded.userId);
      return addCorsHeaders(NextResponse.next({ headers: requestHeaders }));
    } catch (error) {
      console.error("Token verification failed:", error);
      return createErrorResponse("Invalid token", 401);
    }
  }

  // 处理 /wedev 路径
  if (pathname.startsWith("/wedev")) {
    const response = NextResponse.rewrite(
      new URL("/wedev_public/index.html", request.url)
    );
    addCorsHeaders(response);
    response.headers.set("Cross-Origin-Embedder-Policy", "credentialless");
    response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
    return response;
  }

  // 处理动态语言路由
  let locale = pathname.split("/")[1];
  const isDynamicLocale = !locales.includes(locale as Language);
  if (isDynamicLocale) {
    const cookieLang = request.cookies
      .get(DYNAMIC_LANG_COOKIE)
      ?.value.replace("_", "-") as Language;
    locale =
      cookieLang === Language["Chinese(Simplified)"] ||
      cookieLang === Language.English
        ? cookieLang
        : DEFAULT_LANG;

    const resp = NextResponse.rewrite(
      new URL(`/${locale}${pathname}`, request.url)
    );

    resp.headers.set("X-NEXT-INTL-LOCALE", locale);
    resp.cookies.set("NEXT_LOCALE", locale);
    resp.headers.set("X-FULL-PATHNAME", pathname);
    resp.headers.set("X-FULL-SQ", searchParams.toString());
    return resp;
  }

  // 对于其他所有页面路由，直接放行
  return NextResponse.next();
}

export const config = {
  matcher: [
    // 匹配根路径和所有页面路径
    "/",
    "/((?!api|_next/static|_next/image|favicon.ico|wedev).*)",
    // 原有的 API 和 wedev 路径
    "/api/:path*",
    "/wedev/:path*",
  ],
  runtime: "nodejs",
};
