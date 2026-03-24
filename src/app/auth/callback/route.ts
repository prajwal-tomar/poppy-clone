import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    console.error("[auth/callback] Code exchange failed:", error.message);
  }

  const authError = searchParams.get("error_description");
  if (authError) {
    console.error("[auth/callback] Auth error:", authError);
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
