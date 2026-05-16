import { redirect } from "next/navigation";
import { getAdminSession } from "./auth";

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session.isLoggedIn) {
    redirect("/kashfoffice/login");
  }
  return session;
}
