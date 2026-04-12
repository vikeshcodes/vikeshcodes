import type { Metadata } from "next";
import { AuthForm } from "@/components/forms/auth-form";

export const metadata: Metadata = {
  title: "Sign Up | Vikesh Codes",
  robots: {
    index: false,
    follow: false,
  },
};
import { getViewer } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SignupPage() {
  const viewer = await getViewer();
  if (viewer) {
    redirect("/");
  }

  return (
    <div className="container-shell py-16">
      <AuthForm mode="signup" />
    </div>
  );
}
