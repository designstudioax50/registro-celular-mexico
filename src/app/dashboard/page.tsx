import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getConfig } from "@/lib/config";
import DashboardForm from "@/components/DashboardForm";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const config = await getConfig();

  return (
    <DashboardForm initialConfig={config} userEmail={user.email ?? ""} />
  );
}
