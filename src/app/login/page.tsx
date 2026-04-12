import { AuthForm } from "@/components/forms/auth-form";
import { getViewer } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const viewer = await getViewer();
  if (viewer) {
    redirect("/");
  }

  return (
    <div className="container-shell py-16">
      <AuthForm mode="login" />
    </div>
  );
}
