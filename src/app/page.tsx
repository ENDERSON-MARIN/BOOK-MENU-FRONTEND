import { redirect } from "next/navigation";

export default function RootPage() {
  // Redirect root to login page
  // The dashboard layout will handle authentication and redirect to dashboard if logged in
  redirect("/login");
}
