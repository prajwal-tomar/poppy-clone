"use server";

import { createClient } from "@/lib/supabase/server";

export async function forgotPassword(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const email = formData.get("email") as string;

  if (!email || !email.includes("@")) {
    return { error: "Please enter a valid email address." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
