import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const action = params.kindeAuth;
    const url = new URL(request.url);
    const redirectTarget = url.searchParams.get("post_login_redirect_url") || "/dashboard";

    if (action === "health") {
        return NextResponse.json({ ok: true });
    }

    if (action === "logout") {
        return NextResponse.redirect(new URL("/", url));
    }

    if (action === "login" || action === "register" || action === "setup" || action === "kinde_callback") {
        return NextResponse.redirect(new URL(redirectTarget, url));
    }

    return NextResponse.redirect(new URL("/", url));
}