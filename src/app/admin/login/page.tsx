import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { adminSessionCookie, verifyAdminSession } from "@/lib/auth";
import { AdminLoginForm } from "@/components/AdminLoginForm";

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  const session = verifyAdminSession(cookieStore.get(adminSessionCookie)?.value);

  if (session) redirect("/admin");

  return (
    <main className="adminLoginPage">
      <section className="adminLoginCard">
        <img src="/assets/heart-to-heart-logo.svg" alt="Heart to Heart Foundation" />
        <div>
          <p className="eyebrow">Admin access</p>
          <h1>Sign in to Foundation OS</h1>
          <p>Use the admin credentials configured for this environment.</p>
        </div>
        <AdminLoginForm />
      </section>
    </main>
  );
}
