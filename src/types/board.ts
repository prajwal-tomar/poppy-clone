import type { Tables, TablesInsert, TablesUpdate } from "./database";

export type Board = Tables<"boards">;
export type BoardInsert = TablesInsert<"boards">;
export type BoardUpdate = TablesUpdate<"boards">;

export type Profile = Tables<"profiles">;
export type Subscription = Tables<"subscriptions">;

export type DailyAiUsage = Tables<"daily_ai_usage">;
