"use server";

import { createClient } from "@/lib/supabase/server";

interface UsageResult {
  used: number;
  limit: number;
}

export async function getAIUsageToday(): Promise<UsageResult | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase.rpc("get_ai_usage_today", {
    p_user_id: user.id,
  });

  if (!data) return null;

  return data as unknown as UsageResult;
}
